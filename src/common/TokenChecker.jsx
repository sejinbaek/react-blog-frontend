import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { getUserProfile } from '../apis/userApi'
import { setUserInfo } from '../store/userSlice'

export const TokenChecker = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // 현재 경로가 보호된 경로인지 확인
    const protectedPaths = ['/create', '/edit', '/profile']
    const isProtectedPath = protectedPaths.some(path => location.pathname.startsWith(path))

    // 토큰 유효성 확인 함수
    const checkToken = async () => {
      try {
        const userData = await getUserProfile()

        // 토큰이 만료되었거나 유효하지 않은 경우
        if (userData?.error) {
          dispatch(setUserInfo(''))

          // 보호된 경로에 있다면 홈으로 리다이렉트
          if (isProtectedPath) {
            navigate('/')
          }
        }
      } catch (err) {
        console.error('토큰 확인 오류:', err)
        dispatch(setUserInfo(''))

        if (isProtectedPath) {
          navigate('/')
        }
      }
    }

    // 초기 확인
    checkToken()

    // 주기적으로 토큰 유효성 확인 (30초마다)
    const tokenCheckInterval = setInterval(checkToken, 11000)

    return () => clearInterval(tokenCheckInterval)
  }, [dispatch, navigate, location.pathname])

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null
}
