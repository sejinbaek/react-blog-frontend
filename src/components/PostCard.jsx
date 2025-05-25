import { Link, useNavigate } from 'react-router-dom'
import css from './postcard.module.css'
import { formatDate } from '../utils/features'

const PostCard = ({ post }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/post/${post._id}`)
  }
  console.log(post)
  return (
    <article className={css.postcard} onClick={handleClick}>
      <div className={css.post_img}>
        <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
      </div>
      <h3 className={css.title}>{post.title}</h3>
      <div className={css.info}>
        <p>
          <Link to={`/mypage`} className={css.author} onClick={e => e.stopPropagation()}>
            {post.author}
          </Link>
          <time className={css.date}>{formatDate(post.createdAt)}</time>
        </p>
        <p>
          <span>❤️</span>
          <span>30</span>
          <span>💬</span>
          <span>30</span>
        </p>
      </div>
      <p className={css.dec}>{post.summary}</p>
    </article>
  )
}

export default PostCard
