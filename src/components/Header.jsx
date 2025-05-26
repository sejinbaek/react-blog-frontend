import { Link, NavLink, useNavigate } from 'react-router-dom'
import css from './header.module.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserInfo } from '../store/userSlice'
import { getUserProfile, logoutUser } from '../apis/userApi'

export const Header = () => {
  const [isMenuActive, setIsMenuActive] = useState(false)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const user = useSelector(state => state.user.user)
  const username = user?.username

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      try {
        setIsLoading(true)
        const userData = await getUserProfile()
        if (userData) {
          dispatch(setUserInfo(userData))
        }
      } catch (err) {
        console.error(err)
        dispatch(setUserInfo(''))
      } finally {
        setIsLoading(false)
      }
    }
    getProfile()
  }, [dispatch])

  const handleLogout = async () => {
    try {
      await logoutUser()
      dispatch(setUserInfo(''))
      setIsMenuActive(false)
      navigate('/')
    } catch (err) {
      console.log('프로필 조회 실패:', err)
      dispatch(setUserInfo(''))
    }
  }

  if (isLoading) {
    return (
      <header className={css.header}>
        <h1>
          <Link to={'/'}>SEHADANG</Link>
        </h1>
        <div>로딩 중....</div>
      </header>
    )
  }

  const toggleMenu = () => {
    setIsMenuActive(prev => !prev)
  }
  const closeMenu = () => {
    setIsMenuActive(false)
  }

  const handleBackgroundClick = e => {
    if (e.target === e.currentTarget) {
      closeMenu()
    }
  }

  const handleGnbClick = e => {
    e.stopPropagation()
  }
  return (
    <header className={css.header}>
      <h1>
        <Link to={'/'}>SEHADANG</Link>
      </h1>
      <Hamburger isMenuActive={isMenuActive} toggleMenu={toggleMenu} />
      <nav className={css.gnbCon} onClick={handleBackgroundClick}>
        <div className={css.gnb} onClick={handleGnbClick}>
          {username ? (
            <>
              <MenuLike to="/createPost" label="글쓰기" closeMenu={closeMenu} />
              <MenuLike to={`/users/${username}`} label="마이페이지" closeMenu={closeMenu} />
              <button onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <MenuLike to="/register" label="회원가입" closeMenu={closeMenu} />
              <MenuLike to="/login" label="로그인" closeMenu={closeMenu} />
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

const MenuLike = ({ to, label, closeMenu }) => (
  <NavLink to={to} className={({ isActive }) => (isActive ? css.active : '')} onClick={closeMenu}>
    {label}
  </NavLink>
)

const Hamburger = ({ isMenuActive, toggleMenu }) => (
  <button className={`${css.hamburger} ${isMenuActive ? css.active : ''}`} onClick={toggleMenu}>
    {isMenuActive ? (
      // X 아이콘
      <svg xmlns="http://www.w3.org/2000/svg" fill="black" className="bi bi-x" viewBox="0 0 16 16">
        <path
          fillRule="evenodd"
          d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
        />
      </svg>
    ) : (
      // 햄버거 아이콘
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="bi bi-list"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
        />
      </svg>
    )}
  </button>
)
