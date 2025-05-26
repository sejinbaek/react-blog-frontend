import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '../components/Header'
import './index.css'
import css from './defaultlayout.module.css'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const DefaultLayout = () => {
  const location = useLocation()
  const hideHeaderRoutes = ['/register', '/login']

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname)
  return (
    <>
      {!shouldHideHeader && <Header />}{' '}
      <div className={css.defaultlayout}>
        <Outlet />
        <ToastContainer limit={1} />
      </div>
    </>
  )
}
