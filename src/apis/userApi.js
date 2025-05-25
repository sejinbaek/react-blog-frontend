import axios from 'axios'
axios.defaults.withCredentials = true
const API_URL = import.meta.env.VITE_BACK_URL || 'http://localhost:3000'

export const registerUser = async userData => {
  const response = await axios.post(`${API_URL}/auth/register`, userData)
  return response.data
}

export const loginUser = async credentials => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials)
  return response.data
}

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/profile`)
    return response.data
  } catch (error) {
    console.error('프로필 조회 실패', error)
    throw error
  }
}

export const logoutUser = async () => {
  const response = await axios.post(`${API_URL}/auth/logout`)
  return response.data
}
