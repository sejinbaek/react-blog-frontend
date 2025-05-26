import axios from 'axios'
axios.defaults.withCredentials = true
const API_URL = import.meta.env.VITE_BACK_URL

// 댓글 등록 API
export const createComment = async commentData => {
  const response = await axios.post(`${API_URL}/comments`, commentData)
  return response.data
}

// 댓글 조회 API
export const getComments = async postId => {
  const response = await axios.get(`${API_URL}/comments/${postId}`)
  return response.data
}

// 댓글 삭제 API
export const deleteComment = async commentId => {
  const response = await axios.delete(`${API_URL}/comments/${commentId}`)
  return response.data
}
