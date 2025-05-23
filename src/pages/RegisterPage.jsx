import { Link, useNavigate } from 'react-router-dom'
import css from './registerpage.module.css'
import { useState } from 'react'
import { registerUser } from '../apis/userApi'

export const RegisterPage = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordOk, setPasswordOk] = useState('')
  const [errUsername, setErrUserName] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [errPasswordOk, setErrPasswordOk] = useState('')

  const [registerState, setRegisterState] = useState('')
  const navigate = useNavigate()

  const validateUsername = value => {
    if (!value) {
      setErrUserName('')
      return
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]{3,}$/.test(value)) {
      setErrUserName('사용자명은 영문자로 시작하는 4자 이상의 영문자 또는 숫자이어야 합니다')
    } else {
      setErrUserName('')
    }
  }
  const validatePassword = value => {
    if (!value) {
      setErrPassword('')
      return
    }
    if (value.length < 4) {
      setErrPassword('비밀번호는 4자 이상이어야 합니다')
    } else {
      setErrPassword('')
    }
  }
  const validatePasswordOk = (value, current = password) => {
    if (!value) {
      setErrPasswordOk('')
    }
    if (value != current) {
      setErrPasswordOk('비밀번호가 일치하지 않습니다')
    } else {
      setErrPasswordOk('')
    }
  }

  const handleUserNameChange = e => {
    const value = e.target.value
    setUserName(value)
    validateUsername(value)
  }
  const handlePasswordChange = e => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }
  const handlePasswordOkChange = e => {
    const value = e.target.value
    setPasswordOk(value)
    validatePasswordOk(value)
  }

  const register = async e => {
    e.preventDefault()
    console.log('register', username, password, passwordOk)
    validateUsername(username)
    validatePassword(password)
    validatePasswordOk(passwordOk, password)

    if (errUsername || errPassword || errPasswordOk || !username || !password || !passwordOk) {
      return
    }

    try {
      setRegisterState('등록중')
      const response = await registerUser({ username, password })
      console.log('회원가입 성공', response.data)
      setRegisterState('등록 완료')
      navigate('/login')
    } catch (err) {
      setRegisterState('회원가입 실패')
      if (err.response) {
        console.log('회원가입 실패', err.response.data)
      }
    }
  }

  return (
    <main className={css.registerpage}>
      <h2 className={css.title}>회원가입</h2>
      <form className={css.container} onSubmit={register}>
        <input
          type="text"
          placeholder="사용자명을 입력해주세요"
          value={username}
          onChange={handleUserNameChange}
        />
        <strong>{errUsername}</strong>
        <input
          type="password"
          placeholder="패스워드를 입력해주세요"
          value={password}
          onChange={handlePasswordChange}
        />
        <strong>{errPassword}</strong>
        <input
          type="password"
          placeholder="패스워드를 재입력해주세요"
          value={passwordOk}
          onChange={handlePasswordOkChange}
        />
        <strong>{errPasswordOk}</strong>
        <button type="submit">가입하기</button>
      </form>
      <p className={css.loginLink}>
        이미 계정이 있으신가요?
        <Link to="/login" className={css.linkButton}>
          로그인
        </Link>
      </p>
    </main>
  )
}
