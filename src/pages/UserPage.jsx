import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import css from './userpage.module.css'
import { getUserComments, getUserInfo, getUserLikes, getUserPosts } from '../apis/userInfoApi'
import { deleteAccount } from '../apis/userApi'
import { setUserInfo } from '../store/userSlice'
import { formatDate } from '../utils/features'
import { useToast } from '../hooks/useToast'

import NoImage from '../assets/NoImage.png'
import Loading from '../components/Loading'

export const UserPage = () => {
  const { username } = useParams()
  const [userData, setUserData] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [userComments, setUserComments] = useState([])
  const [userLikes, setUserLikes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 현재 로그인한 사용자 정보
  const currentUser = useSelector(state => state.user.user)
  const isCurrentUser = currentUser && currentUser.username === username

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showSuccessToast, showErrorToast } = useToast()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)

        // API 호출을 통해 데이터 가져오기
        const userData = await getUserInfo(username)
        const postsData = await getUserPosts(username)
        const commentsData = await getUserComments(username)
        const likesData = await getUserLikes(username)

        setUserData(userData)
        setUserPosts(postsData)
        setUserComments(commentsData)
        setUserLikes(likesData)
      } catch (error) {
        console.error('사용자 데이터 로딩 실패:', error)
        setError('사용자 정보를 불러오는 데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserData()
  }, [username])

  // 회원 탈퇴 처리 핸들러
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 계정 정보가 삭제됩니다.'
    )

    if (!confirmed) return

    try {
      setIsDeleting(true)
      await deleteAccount()

      dispatch(setUserInfo('')) // redux 상태 초기화
      showSuccessToast('회원 탈퇴가 완료되었습니다')
      navigate('/', { replace: true })
    } catch (error) {
      console.error('회원 탈퇴 실패:', error)
      showErrorToast('회원 탈퇴에 실패했습니다. 다시 시도해주세요')
      setIsDeleting(false)
    }
  }

  if (isLoading) return <Loading />
  if (error) return <div>{error}</div>
  if (!userData) return <div>사용자를 찾을 수 없습니다.</div>

  return (
    <main className={css.userpage}>
      <h1>마이페이지</h1>
      <section>
        <div className={css.userInfo}>
          <h2>
            <span>반가워요,</span>
            <br />
            {username}님!
          </h2>
          {isCurrentUser && (
            <div className={css.ButtonArea}>
              <button className={css.editButton}>
                <Link to={`/update-profile`}>내 정보 수정</Link>
              </button>
              <button
                onClick={handleDeleteAccount}
                className={css.deleteButton}
                disabled={isDeleting}
              >
                {isDeleting ? '처리 중...' : '회원 탈퇴'}
              </button>
            </div>
          )}
        </div>
      </section>

      <section>
        <h3>내 게시물 ({userPosts.length})</h3>
        {userPosts.length > 0 ? (
          <ul className={css.postList}>
            {userPosts.map(post => (
              <li key={post._id} className={css.postCard}>
                <Link to={`/post/${post._id}`}>
                  <p className={css.title}>{post.title}</p>
                  <p className={css.postDate}>{formatDate(post.createdAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 글이 없습니다.</p>
        )}
      </section>

      <section>
        <h3>내 댓글 ({userComments.length})</h3>
        {userComments.length > 0 ? (
          <ul className={css.commentList}>
            {userComments.map(comment => (
              <li key={comment._id} className={css.commentCard}>
                <p className={css.commentContent}>{comment.content}</p>
                <div className={css.commentMeta}>
                  <Link to={`/post/${comment.postId}`}>원문 보기</Link>
                  <p>작성일:{formatDate(comment.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 글이 없습니다.</p>
        )}
      </section>

      <section>
        <h3>좋아요 누른 게시물 ({userLikes.length})</h3>
        {userLikes.length > 0 ? (
          <ul className={css.likeList}>
            {userLikes.map(post => (
              <li key={post._id} className={css.likeCard}>
                <Link to={`/post/${post._id}`}>
                  {post.cover ? (
                    <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
                  ) : (
                    <img src={NoImage} alt="기본 이미지" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>좋아요 클릭한 글이 없습니다.</p>
        )}
      </section>
    </main>
  )
}
