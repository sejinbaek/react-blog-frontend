import { useEffect, useState } from 'react'
import css from './registerpage.module.css'
import logincss from './loginpage.module.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUser } from '../apis/userApi'
import { setUserInfo } from '../store/userSlice'

export const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errUsername, setErrUsername] = useState('')
  const [errPassword, setErrPassword] = useState('')

  const [loginStatus, setLoginStatus] = useState('') // 로그인 상태 여부
  const [redirect, setRedirect] = useState(false) // 로그인 상태 메시지

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validateUsername = value => {
    if (!value) {
      setErrUsername('')
      return
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]{3,}$/.test(value)) {
      setErrUsername('사용자명은 영문자로 시작하는 4자 이상의 영문자 또는 숫자여야 합니다.')
    } else {
      setErrUsername('')
    }
  }
  const validatePassword = value => {
    if (!value) {
      setErrPassword('')
      return
    }
    if (value.length < 4) {
      setErrPassword('패스워드는 4자 이상이어야 합니다.')
    } else {
      setErrPassword('')
    }
  }
  const handleUsernameChange = e => {
    const value = e.target.value
    setUsername(value)
    validateUsername(value)
  }
  const handlePasswordChange = e => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }

  const login = async e => {
    e.preventDefault()
    setLoginStatus('')
    validateUsername(username)
    validatePassword(password)
    if (errPassword || errUsername || !username || !password) {
      setLoginStatus('아이디와 비밀번호를 확인하세요')
      return
    }

    try {
      const userData = await loginUser({ username, password })

      if (userData) {
        setLoginStatus('로그인 성공')
        dispatch(setUserInfo(userData))

        setTimeout(() => {
          setRedirect(true)
        }, 500)
      } else {
        setLoginStatus('사용자가 없습니다')
      }
    } catch (err) {
      console.error('로그인 오류---', err)
      return
    } finally {
      setLoginStatus(false)
    }
  }

  useEffect(() => {
    if (redirect) {
      navigate('/')
    }
  }, [redirect, navigate])

  return (
    <main className={logincss.loginpage}>
      <h2 className={css.title}>로그인</h2>
      {loginStatus && <strong>로그인 성공</strong>}
      <form className={css.container} onSubmit={login}>
        <fieldset className={logincss.fieldGroup}>
          <input
            type="text"
            placeholder=" "
            value={username}
            onChange={handleUsernameChange}
            required
            id="username"
          />
          <legend htmlFor="username">사용자명</legend>
        </fieldset>
        <strong>{errUsername}</strong>
        <fieldset className={logincss.fieldGroup}>
          <input
            type="password"
            placeholder=""
            value={password}
            onChange={handlePasswordChange}
            id="password"
          />
          <legend htmlFor="password">비밀번호</legend>
        </fieldset>
        <strong>{errPassword}</strong>
        <button type="submit">로그인</button>
      </form>
    </main>
  )
}
