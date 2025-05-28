import css from './loading.module.css'
import loadingImage from '../assets/loadingImage.svg'

const Loading = () => {
  return (
    <div className={css.loading}>
      <div>
        <img src={loadingImage} alt="로딩 이미지" />
      </div>

      <p>LOADING...♥️</p>
    </div>
  )
}

export default Loading
