import css from '../common/fullscreenlayout.module.css'

export const FullScreenLayout = ({ children }) => {
  return <div className={css.fullscreenLayout}>{children}</div>
}
