import { useCallback, useEffect, useRef, useState } from 'react'
import css from './postlistpage.module.css'
import PostCard from '../components/PostCard'
import { getPostList } from '../apis/postApi'

import mainImage from '../assets/karigurashi021.jpg'
import Loading from '../components/Loading'
import { useToast } from '../hooks/useToast'

export const PostListPage = () => {
  const [postList, setPostList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // 토스트
  const { showDefaultToast } = useToast()

  // 페이지네이션 상태 관리
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const listRef = useRef(null)
  const observer = useRef()

  useEffect(() => {
    const hasShownToast = localStorage.getItem('hasShownToast')
    if (!hasShownToast) {
      setTimeout(() => {
        showDefaultToast('오늘의 기분을 글로 적어보는 건 어떤가요?')
        localStorage.setItem('hasShownToast', 'true')
      }, 1000)
    }
  }, [])

  const lastPostElementRef = useCallback(
    node => {
      if (isLoading || !node) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1)
        }
      })
      observer.current.observe(node)
    },
    [isLoading, hasMore]
  )

  useEffect(() => {
    const fetchPostList = async () => {
      try {
        // 페이지가 0보다 크면 추가 데이터 로딩
        if (page > 0) setIsLoading(true)
        // 수정된 페이지 정보 전달
        const data = await getPostList(page)

        // 응답 안전성 검사
        if (!data || !Array.isArray(data.posts)) {
          throw new Error('유효하지 않은 응답 형식입니다.')
        }

        setPostList(prev => (page === 0 ? data.posts : [...prev, ...data.posts]))
        setHasMore(data.hasMore)
      } catch (error) {
        console.error('목록조회 실패:', error)
        setError('글 목록을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPostList()
  }, [page])

  return (
    <main className={css.postlistpage}>
      <div className={css.postlist_img}>
        <img src={mainImage} alt="메인이미지" />
      </div>
      {error && <p className={css.errorMessage}>{error}</p>}
      {isLoading ? (
        <Loading />
      ) : postList?.length === 0 ? (
        <p className={css.noPostMessage}>첫 번째 글의 주인공이 되어주세요</p>
      ) : (
        <ul className={css.postList} ref={listRef}>
          {postList.map((post, i) => (
            <li key={post._id} ref={i === postList.length - 1 ? lastPostElementRef : null}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
