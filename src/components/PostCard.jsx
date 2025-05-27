import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineMessage } from 'react-icons/ai'

import { formatDate } from '../utils/features'
import css from './postcard.module.css'
import LikeButton from './LikeButton'

import defaultImage from '../assets/chihiro014.jpg'

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
        <img
          src={post.cover ? `${import.meta.env.VITE_BACK_URL}/${post.cover}` : defaultImage}
          alt={post.title}
        />
      </div>
      <h3 className={css.title}>{post.title}</h3>
      <div className={css.infoWrapper}>
        <div>
          <Link to={`/mypage/${post.author}`} className={css.author} onClick={handleAuthorClick}>
            {post.author}
          </Link>
        </div>
        <div className={css.info}>
          <time className={css.date}>{formatDate(post.createdAt)}</time>
          <div className={css.btnsWrapper}>
            <LikeButton postId={post._id} likes={post.likes} />
            <AiOutlineMessage className={css.commentIcon} /> {post.commentCount || 0}
          </div>
        </div>
      </div>
      <p className={css.dec}>{post.summary}</p>
    </article>
  )
}

export default PostCard
