import css from './postlistpage.module.css'
import PostCard from '../components/PostCard'

import mainImage from '../assets/karigurashi022.jpg'

const PostListPage = () => {
  return (
    <main className={css.postlistpage}>
      <div className={css.postlist_img}>
        <img src={mainImage} alt="" />
      </div>
      <ul className={css.postList}>
        <li>
          <PostCard />
        </li>
        <li>
          <PostCard />
        </li>
        <li>
          <PostCard />
        </li>
        <li>
          <PostCard />
        </li>
      </ul>
    </main>
  )
}

export default PostListPage
