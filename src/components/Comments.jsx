import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import css from './comments.module.css'
import { getComments, createComment, deleteComment, updateComment } from '../apis/commentApi.js'
import { formatDate } from '../utils/features.js'
import { useToast } from '../hooks/useToast.js'

export default function Comments({ postId, onCommentCountChange }) {
  const userInfo = useSelector(state => state.user.user)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [comments, setComments] = useState([])
  const [editState, setEditState] = useState({ id: null, content: '' })

  const { showErrorToast } = useToast()

  const fetchComments = useCallback(async () => {
    try {
      const response = await getComments(postId)
      setComments(response)

      // 댓글 수를 부모 컴포넌트에 전달
      if (onCommentCountChange) {
        onCommentCountChange(response.length)
      }
    } catch (error) {
      console.error('댓글 목록 조회 실패:', error)
      showErrorToast('댓글 목록 조회에 실패했습니다.')
    }
  }, [postId, onCommentCountChange])

  // postId가 바뀔 때마다 댓글 목록 가져오기
  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // 폼 제출 핸들러
  const handleSubmit = async e => {
    e.preventDefault()
    if (!newComment.trim()) {
      showErrorToast('댓글을 입력하세요')
      return
    }

    try {
      setIsLoading(true)

      // 댓글 등록 API 호출
      const commentData = {
        content: newComment,
        author: userInfo.username,
        postId,
      }

      const response = await createComment(commentData)
      const updatedComments = [response, ...comments]

      // 새 댓글 추가하고 입력창 초기화
      setComments(updatedComments)
      setNewComment('')

      // 댓글이 추가되면 댓글 수 업데이트
      if (onCommentCountChange) {
        onCommentCountChange(updatedComments.length)
      }
    } catch (error) {
      console.error('댓글 등록 실패:', error)
      showErrorToast('댓글 등록에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 댓글 삭제 핸들러
  const handleDelete = async commentId => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      setIsLoading(true)
      // 댓글 삭제 API 호출
      await deleteComment(commentId)
      const updatedComments = comments.filter(comment => comment._id !== commentId)
      // 댓글 목록에서 삭제된 댓글 제거
      setComments(updatedComments)

      // 댓글이 삭제되면 댓글 수 업데이트
      if (onCommentCountChange) {
        onCommentCountChange(updatedComments.length)
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
      showErrorToast('댓글 삭제에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 댓글 수정 모드 활성화
  const handleEditMode = comment => {
    setEditState({ id: comment._id, content: comment.content })
  }

  // 댓글 수정 완료
  const handleUpdateComment = async commentId => {
    if (!editState.content.trim()) {
      showErrorToast('댓글 내용을 입력하세요')
      return
    }

    try {
      setIsLoading(true)

      // 댓글 수정 API 호출
      await updateComment(commentId, editState.content)

      // 댓글 목록 업데이트
      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === commentId ? { ...comment, content: editState.content } : comment
        )
      )
      // 수정 모드 종료
      handleCancelEdit()
    } catch (error) {
      console.error('댓글 수정에 실패했습니다', error)
      showErrorToast('댓글 수정에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditState({ id: null, content: '' })
  }

  const renderCommentItem = comment => {
    const isEditing = editState.id === comment._id
    const isAuthor = userInfo.username === comment.author

    return (
      <li key={comment._id} className={css.list}>
        <div className={css.comment}>
          <p className={css.author}>{comment.author}</p>

          {isEditing ? (
            <textarea
              value={editState.content}
              onChange={e => setEditState({ ...editState, content: e.target.value })}
              className={css.text}
              disabled={isLoading}
            />
          ) : (
            <>
              <p className={css.date}>{formatDate(comment.createdAt)}</p>
              <p className={css.text}>{comment.content}</p>
            </>
          )}
        </div>

        {isEditing ? (
          <div className={css.btns}>
            <button onClick={() => handleUpdateComment(comment._id)} disabled={isLoading}>
              수정완료
            </button>
            <button onClick={handleCancelEdit} disabled={isLoading}>
              취소
            </button>
          </div>
        ) : (
          isAuthor && (
            <div className={css.btns}>
              <button onClick={() => handleEditMode(comment)}>수정</button>
              <button onClick={() => handleDelete(comment._id)}>삭제</button>
            </div>
          )
        )}
      </li>
    )
  }

  return (
    <section className={css.comments}>
      {/* 로그인하지 않은 경우 안내 문구만 */}
      {!userInfo?.username && (
        <p className={css.logMessage}>
          댓글을 작성하려면{' '}
          <Link to="/login" className={css.goLogin}>
            로그인
          </Link>
          이 필요합니다.
        </p>
      )}

      {/* 로그인한 경우에만 댓글 입력 폼 보여줌 */}
      {userInfo?.username && (
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? '등록 중...' : '댓글 등록'}
          </button>
        </form>
      )}

      {/* 댓글 목록은 항상 보여줌 */}
      <ul className={css.commentsList}>
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map(renderCommentItem)
        ) : (
          <li className={css.list}>
            <p className={css.text}>등록된 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
          </li>
        )}
      </ul>
    </section>
  )
}
