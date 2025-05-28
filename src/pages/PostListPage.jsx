import { useCallback, useEffect, useRef, useState } from 'react'
import { getPostList } from '../apis/postApi'
import { useToast } from '../hooks/useToast'
import css from './postlistpage.module.css'
import PostCard from '../components/PostCard'
import Loading from '../components/Loading'
import mainImage from '../assets/karigurashi021.jpg'
import PostCardSkeleton from '../components/PostCardSkeleton'

export const PostListPage = () => {
  const [postList, setPostList] = useState([])
  const [initialLoading, setInitialLoading] = useState(true) // 초기 로딩용
  const [loadingMore, setLoadingMore] = useState(false) // 추가 로딩용
  const [error, setError] = useState(null)

  // 페이지네이션 상태 처리
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const listRef = useRef(null)
  const observer = useRef()

  const { showDefaultToast } = useToast()

  // 토스트는 최초 마운트 때만 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      showDefaultToast('⭐ 오늘의 기분을 글로 적어보는 건 어떤가요?')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // 무한 스크롤 Intersection Observer
  const lastPostElementRef = useCallback(
    node => {
      if (loadingMore || initialLoading || !node) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore) {
            setTimeout(() => setPage(prev => prev + 1), 150) // 트리거 지연
          }
        },
        {
          threshold: 1.0, // 완전히 보여야 실행되도록
        }
      )
      observer.current.observe(node)
    },
    [loadingMore, initialLoading, hasMore]
  )

  // 게시글 리스트 가져오기
  useEffect(() => {
    const fetchPostList = async () => {
      try {
        page === 0 ? setInitialLoading(true) : setLoadingMore(true)

        const data = await getPostList(page, 6)

        if (!data || !Array.isArray(data.posts)) {
          throw new Error('유효하지 않은 응답 형식입니다.')
        }

        setPostList(prev => (page === 0 ? data.posts : [...prev, ...data.posts]))
        setHasMore(data.hasMore)
      } catch (error) {
        console.error('목록 조회 실패:', error)
        setError('글 목록을 불러오는데 실패했습니다.')
      } finally {
        setInitialLoading(false)
        setLoadingMore(false)
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
      {initialLoading ? (
        <ul className={css.postList}>
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <PostCardSkeleton />
            </li>
          ))}
        </ul>
      ) : postList?.length === 0 ? (
        <p className={css.noPostMessage}>첫 번째 글의 주인공이 되어주세요</p>
      ) : (
        <>
          <ul className={css.postList} ref={listRef}>
            {postList.map((post, i) => (
              <li key={post._id} ref={i === postList.length - 1 ? lastPostElementRef : null}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
          {loadingMore && <div className={css.loadingMore}>📦 더 불러오는 중...</div>}
        </>
      )}
    </main>
  )
}
