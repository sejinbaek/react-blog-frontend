import { Link, useNavigate } from 'react-router-dom'
import css from './postcard.module.css'
import { formatDate } from '../utils/features'

import LikeButton from './LikeButton'

const PostCard = ({ post }) => {
  const navigate = useNavigate()

  const goDetail = () => {
    navigate(`/post/${post._id}`)
  }
  const handleAuthorClick = e => {
    e.stopPropagation()
  }

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
          <LikeButton postId={post._id} likes={post.likes} />
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
