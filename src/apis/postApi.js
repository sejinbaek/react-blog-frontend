import axios from 'axios'
axios.defaults.withCredentials = true

const API_URL = import.meta.env.VITE_BACK_URL

// 포스트 등록 API
export const createPost = async postData => {
  const response = await axios.post(`${API_URL}/posts`, postData)
  return response.data
}

// 포스트 리스트 조회 API
export const getPostList = async (page = 0, limit = 3) => {
  const response = await axios.get(`${API_URL}/posts`, { params: { page, limit } })
  return response.data
}

// 포스트 상세 조회 API
export const getPostDetail = async postId => {
  const response = await axios.get(`${API_URL}/posts/${postId}`)
  return response.data
}

// 포스트 삭제 API
export const deletePost = async postId => {
  const response = await axios.delete(`${API_URL}/posts/${postId}`)
  return response.data
}

// 포스트 수정 API
export const updatePost = async (postId, postData) => {
  const response = await axios.put(`${API_URL}/posts/${postId}`, postData)
  return response.data
}

// 포스트 좋아요 API
export const toggleLike = async postId => {
  const response = await axios.post(`${API_URL}/posts/${postId}/like`)
  return response.data
}
