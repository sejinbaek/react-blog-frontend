import { Link } from 'react-router-dom'
import css from './postcard.module.css'

import cardImg from '../assets/karigurashi050.jpg'

const PostCard = () => {
  return (
    <article className={css.postcard}>
      <div className={css.post_img}>
        <img src={cardImg} alt="" />
      </div>
      <h3 className={css.title}>포스트 제목</h3>
      <div classname={css.info}>
        <p>
          <Link to={`/mypage`} className={css.author}>
            sejin
          </Link>
          <time className={css.date}>2025.05.05</time>
        </p>
        <p>
          <span>❤️</span>
          <span>30</span>
          <span>💬</span>
          <span>30</span>
        </p>
      </div>
      <p className={css.dec}>
        요약 내용이 들어갑니다. 내용이 길 ~~~ 수 있어요. 요약 내용이 들어갑니다. 내용이 길 ~~~ 수
        있어요. 요약 내용이 들어갑니다. 내용이 길 ~~~ 수 있어요. 요약 내용이 들어갑니다. 내용이 길
        ~~~ 수 있어요. 요약 내용이 들어갑니다. 내용이 길 ~~~ 수 있어요 요약 내용이 들어갑니다.요약
        내용이 들어갑니다.요약 내용이 들어갑니다.요약 내용이 들어갑니다.요약 내용이 들어갑니다.요약
        내용이 들어갑니다.요약 내용이 들어갑니다.요약 내용이 들어갑니다.요약 내용이 들어갑니다.
      </p>
    </article>
  )
}

export default PostCard
