import { useEffect, useState } from 'react'
import css from './createpost.module.css'
import QuillEditor from '../components/QuillEditor'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { createPost } from '../apis/postApi'

export const CreatePost = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [files, setFiles] = useState([])
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const user = useSelector(state => state.user.user)
  // 사용자 정보가 없으면 로그인 페이지로 리디렉션
  useEffect(() => {
    if (!user || !user.username) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleContentChange = content => {
    setContent(content)
  }

  const handleCreatePost = async e => {
    e.preventDefault()

    setIsSubmitting(true)
    setError('')

    if (!title || !summary || !content) {
      setIsSubmitting(false)
      setError('모든 필드를 입력해주세요')
      return
    }

    //백엔드로 전송할 데이터 생성
    const data = new FormData()
    data.set('title', title)
    data.set('summary', summary)
    data.set('content', content)

    if (files.length > 0) {
      data.set('files', files[0])
    }

    try {
      await createPost(data)
      console.log('등록 성공')
      setIsSubmitting(true)
      navigate('/')
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitting(false)
      setError('')
    }
  }

  return (
    <main className={css.createpost}>
      {error && <div className={css.error}>{error}</div>}
      <form className={css.writecon} onSubmit={handleCreatePost}>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={css.title}
        />

        <input
          type="text"
          id="summary"
          name="summary"
          placeholder="요약내용을 입력해주세요"
          value={summary}
          onChange={e => setSummary(e.target.value)}
          className={css.summary}
        />
        <input
          type="file"
          id="files"
          name="files"
          accept="image/*"
          onChange={e => setFiles(e.target.files)}
        />
        <div className={css.editorWrapper}>
          <QuillEditor
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력해주세요"
          />
        </div>
        <button type="submit" disabled={isSubmitting} className={css.submitBtn}>
          {isSubmitting ? '등록중...' : '등록'}
        </button>
      </form>
    </main>
  )
}
