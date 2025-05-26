import axios from 'axios'
axios.defaults.withCredentials = true
const API_URL = import.meta.env.VITE_BACK_URL || 'http://localhost:3000'

// 특정 사용자 정보 조회
export const getUserInfo = async username => {
  try {
    const response = await axios.get(`${API_URL}/users/${username}`)
    return response.data
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error)
    throw error
  }
}

// 특정 사용자가 작성한 글 조회
export const getUserPosts = async username => {
  try {
    const response = await axios.get(`${API_URL}/users/${username}/posts`)
    return response.data
  } catch (error) {
    console.error('사용자 게시물 조회 싥패:', error)
    throw error
  }
}

// 특정 사용자가 작성한 댓글 조회
export const getUserComments = async username => {
  try {
    const response = await axios.get(`${API_URL}/users/${username}/comments`)
    return response.data
  } catch (error) {
    console.error('사용자 댓글 조회 실패', error)
    throw error
  }
}

// 특정 사용자가 좋아요 클릭한 글 조회
export const getUserLikes = async username => {
  try {
    const response = await axios.get(`${API_URL}/users/${username}/likes`)
    return response.data
  } catch (error) {
    console.error('사용자 좋아요 게시물 조회 실패:', error)
    throw error
  }
}

// 특정 사용자 정보 수정
export const updateUserInfo = async userData => {
  try {
    const response = await axios.put(`${API_URL}/users/update`, userData)
    return response.data
  } catch (error) {
    console.log('사용자 정보 수정 실패', error)
    throw error
  }
}
