import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '../components/Header'
import './index.css'
import css from './defaultlayout.module.css'

export const DefaultLayout = () => {
  const location = useLocation()
  const hideHeaderRoutes = ['/register', '/login']

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname)
  return (
    <div className={css.defaultlayout}>
      {!shouldHideHeader && <Header />}
      <Outlet />
    </div>
  )
}
