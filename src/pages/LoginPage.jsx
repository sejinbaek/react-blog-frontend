import { useState } from 'react'
import css from './registerpage.module.css'

export const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errUsername, setErrUsername] = useState('')
  const [errPassword, setErrPassword] = useState('')

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
    console.log('로그인')
  }
  return (
    <main className={css.loginpage}>
      <h2>로그인 페이지</h2>
      <form className={css.container} onSubmit={login}>
        <input value={username} onChange={handleUsernameChange} type="text" placeholder="아이디" />
        <strong>{errUsername}</strong>
        <input
          value={password}
          onChange={handlePasswordChange}
          type="password"
          placeholder="패스워드"
        />
        <strong>{errPassword}</strong>
        <button type="submit">로그인</button>
      </form>
    </main>
  )
}
