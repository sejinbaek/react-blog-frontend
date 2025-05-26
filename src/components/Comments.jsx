import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import css from './comments.module.css'
import { getComments, createComment, deleteComment, updateComment } from '../apis/commentApi.js'
import { formatDate } from '../utils/features.js'
import { useToast } from '../hooks/useToast.js'

export default function Comments({ postId }) {
  const userInfo = useSelector(state => state.user.user)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [comments, setComments] = useState([])
  const [editContent, setEditContent] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)

  const { showErrorToast } = useToast()

  // postId가 바뀔 때마다 댓글 목록 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(postId)
        console.log('댓글 목록 조회 성공', response)
        setComments(response)
      } catch (error) {
        console.error('댓글 목록 조회 실패:', error)
        showErrorToast('댓글 목록 조회에 실패했습니다.')
      }
    }
    fetchComments()
  }, [postId])

  // 폼 제출 핸들러
  const handleSubmit = async e => {
    e.preventDefault()
    if (!newComment) {
      showErrorToast('댓글을 입력하세요')
      return
    }

    try {
      setIsLoading(true)

      // 댓글 등록 API 호출
      const commentData = {
        content: newComment,
        author: userInfo.username,
        postId: postId,
      }

      const response = await createComment(commentData)
      console.log('댓글 등록 성공:', response)

      // 새 댓글 추가하고 입력창 초기화
      setComments(prevComments => [response, ...prevComments])
      setNewComment('')
      setIsLoading(false)
    } catch (error) {
      console.error('댓글 등록 실패:', error)
      showErrorToast('댓글 등록에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 댓글 삭제 핸들러
  const handleDelete = async commentId => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        setIsLoading(true)
        // 댓글 삭제 API 호출
        const response = await deleteComment(commentId)
        console.log('댓글 삭제 성공:', response)
        // 댓글 목록에서 삭제된 댓글 제거
        setComments(prevComments => prevComments.filter(comment => comment._id !== commentId))
        setIsLoading(false)
      } catch (error) {
        console.error('댓글 삭제 실패:', error)
        showErrorToast('댓글 삭제에 실패했습니다.')
        setIsLoading(false)
      }
    }
  }

  // 댓글 수정 모드 활성화
  const handleEditMode = comment => {
    setEditingCommentId(comment._id)
    setEditContent(comment.content)
  }

  // 댓글 수정 완료
  const handleUpdateComment = async commentId => {
    if (!editContent) {
      showErrorToast('댓글 내용을 입력하세요')
      return
    }

    try {
      setIsLoading(true)

      // 댓글 수정 API 호출
      const response = await updateComment(commentId, editContent)
      console.log('댓글 수정 성공:', response)

      // 댓글 목록 업데이트
      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === commentId ? { ...comment, content: editContent } : comment
        )
      )

      // 수정 모드 종료
      setEditingCommentId(null)
      setEditContent('')
    } catch (error) {
      console.error('댓글 수정에 실패했습니다', error)
      showErrorToast('댓글 수정에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditContent('')
  }

  return (
    <section className={css.comments}>
      {userInfo.username ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            disabled={isLoading}
          ></textarea>
          <button type="submit" disabled={isLoading}>
            {isLoading ? '등록 중...' : '댓글 등록'}
          </button>
        </form>
      ) : (
        <p className={css.logMessage}>
          댓글을 작성하려면 <Link to="/login">로그인이 필요합니다.</Link>
        </p>
      )}

      <ul>
        {comments && comments.length > 0 ? (
          // 일반 모드, 수정 모드 조건문으로 분기
          comments.map(comment => (
            <li key={comment._id} className={css.list}>
              {editingCommentId === comment._id ? (
                <>
                  <div className={css.comment}>
                    <p className={css.author}>{comment.author}</p>
                    <p className={css.date}>{formatDate(comment.createdAt)}</p>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className={css.text}
                      disabled={isLoading}
                    ></textarea>
                  </div>
                  <div className={css.btns}>
                    <button onClick={() => handleUpdateComment(comment._id)}>수정 완료</button>
                    <button onClick={handleCancelEdit} disabled={isLoading}>
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={css.comment}>
                    <p className={css.author}>{comment.author}</p>
                    <p className={css.date}>{formatDate(comment.createdAt)}</p>
                    <p className={css.text}>{comment.content}</p>
                  </div>
                  <div className={css.btns}>
                    <button onClick={() => handleEditMode(comment)}>수정</button>
                    <button onClick={() => handleDelete(comment._id)}>삭제</button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <li className={css.list}>
            <p className={css.text}>등록된 댓글이 없습니다. 첫 댓글을 작성해보세요</p>
          </li>
        )}
      </ul>
    </section>
  )
}
