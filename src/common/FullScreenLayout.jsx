import css from '../common/Fullscreenlayout.module.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const FullScreenLayout = ({ children }) => {
  return (
    <div className={css.fullscreenLayout}>
      {children}
      <ToastContainer limit={1} />
    </div>
  )
}
