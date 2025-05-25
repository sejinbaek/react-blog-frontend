import { Link, useNavigate } from 'react-router-dom'
import css from './postcard.module.css'
import { formatDate } from '../utils/features'
import { useState } from 'react'
import { toggleLike } from '../apis/postApi'

import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0)

  const navigate = useNavigate()

  const goDetail = () => {
    navigate(`/post/${post._id}`)
  }
  const handleAuthorClick = e => {
    e.stopPropagation()
  }

  const handleLikeToggle = async e => {
    e.stopPropagation()

    try {
      // 좋아요 토글 API 호출
      const updatedPost = await toggleLike(post._id)

      // 상태 업데이트
      setIsLiked(!isLiked)
      setLikesCount(updatedPost.likes.length)
    } catch (error) {
      console.error('좋아요 토글 실패:', error)

      // 로그인이 필요한 경우 로그인 페이지로 이동
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.')
        navigate('/login')
      }
    }
  }

  console.log(post)
  return (
    <article className={css.postcard} onClick={goDetail}>
      <div className={css.post_img}>
        <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
      </div>
      <h3 className={css.title}>{post.title}</h3>
      <div className={css.info}>
        <div>
          <Link to={`/mypage/${post.author}`} className={css.author} onClick={handleAuthorClick}>
            {post.author}
          </Link>
          <time className={css.date}>{formatDate(post.createdAt)}</time>
        </div>
        <div className={css.Wrapper}>
          <div className={css.heartWrapper}>
            <span onClick={handleLikeToggle} className={`${css.heart} ${isLiked ? css.liked : ''}`}>
              {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
            </span>
            <span>{likesCount}</span>
          </div>
          <div className={css.commentWrapper}>
            <span>💬</span>
            <span>30</span>
          </div>
        </div>
      </div>
      <p className={css.dec}>{post.summary}</p>
    </article>
  )
}

export default PostCard
