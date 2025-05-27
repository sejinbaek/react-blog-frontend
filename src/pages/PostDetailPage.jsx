import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineMessage } from 'react-icons/ai'

import { getPostDetail, deletePost } from '../apis/postApi'
import { formatDate } from '../utils/features'

import css from './postdetailpage.module.css'
import LikeButton from '../components/LikeButton'
import Comments from '../components/Comments'

import defaultImage from '../assets/ponyo050.jpg'
import UrlButton from '../components/UrlButton'

export const PostDetailPage = () => {
  const username = useSelector(state => state.user.user.username)
  const { postId } = useParams()
  // postId를 이용하여 서버에 요청하여 상세 정보를 가져옴

  const [postInfo, setPostInfo] = useState()
  const [commentCount, setCommentCount] = useState(0)

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const data = await getPostDetail(postId)
        console.log(data)
        setPostInfo(data)
        // 초기 댓글 수 설정
        setCommentCount(data.commentCount || 0)
      } catch (error) {
        console.error('상세정보 조회 실패:', error)
      }
    }
    fetchPostDetail()
  }, [postId])

  const updateCommentCount = count => {
    setCommentCount(count)
  }

  const handleDeletePost = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deletePost(postId)
        alert('삭제되었습니다.')
        window.location.href = '/'
      } catch (error) {
        console.error('글 삭제 실패:', error)
        alert('삭제에 실패했습니다.')
      }
    }
  }

  return (
    <main className={css.postdetailpage}>
      <section>
        <div className={css.detailimg}>
          <img
            src={
              postInfo?.cover ? `${import.meta.env.VITE_BACK_URL}/${postInfo?.cover}` : defaultImage
            }
            alt="포스트이미지"
          />
        </div>
        <h3 className={css.title}>{postInfo?.title}</h3>
        <div className={css.info}>
          <span className={css.author}>{postInfo?.author}</span>
          <p className={css.date}>{formatDate(postInfo?.updatedAt)}</p>
          <UrlButton className={css.urlButton} />
        </div>
        <div className={css.summary}>{postInfo?.summary}</div>
        {/* Quill 에디터로 작성된 HTML 콘텐츠를 렌더링 */}
        <div
          className={`${css.content} ql-content`}
          dangerouslySetInnerHTML={{ __html: postInfo?.content }}
        ></div>
      </section>
      <section className={css.btns}>
        <div className={css.likeCommentWrapper}>
          {postInfo && <LikeButton postId={postId} likes={postInfo.likes} />}
          <span className={css.commentContent}>
            <AiOutlineMessage className={css.commentIcon} /> {commentCount}
          </span>
        </div>
        <div className={css.btnsWrapper}>
          {/* 로그인한 사용자만 글 수정, 삭제 가능 */}
          {username === postInfo?.author && (
            <>
              <Link to={`/edit/${postId}`}>수정</Link>
              <span onClick={handleDeletePost}>삭제</span>
            </>
          )}
          <Link to="/">목록으로</Link>
        </div>
      </section>
      {/* 업데이트된 Comments 컴포넌트에 commentCount와 updateCommentCount 함수 전달 */}
      <Comments
        postId={postId}
        commentCount={commentCount}
        onCommentCountChange={updateCommentCount}
      />
    </main>
  )
}
