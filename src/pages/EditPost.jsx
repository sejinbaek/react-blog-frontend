import { useEffect, useState } from 'react'
import QuillEditor from '../components/QuillEditor'
import css from './editpost.module.css'
import style from './createpost.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getPostDetail, updatePost } from '../apis/postApi'
import { useToast } from '../hooks/useToast'
import Loading from '../components/Loading'

export const EditPost = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user)

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [files, setFiles] = useState('')
  const [content, setContent] = useState('')
  const [currentImage, setCurrentImage] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { showErrorToast, showWarnToast } = useToast()

  // 사용자 정보가 없으면 로그인 페이지로 리디렉션
  useEffect(() => {
    if (!user || !user.username) {
      navigate('/login')
    }
  }, [user, navigate])

  // 글 정보 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        const postData = await getPostDetail(postId)

        // 현재 사용자와 글 작성자가 다르면 접근 제한
        if (postData.author !== user?.username) {
          navigate('/')
          return
        }

        // 글 데이터 설정
        setTitle(postData.title)
        setSummary(postData.summary)
        setContent(postData.content)

        // 이미지가 있으면 이미지 URL 설정
        if (postData.cover) {
          setCurrentImage(`${import.meta.env.VITE_BACK_URL}/${postData.cover}`)
        }
      } catch (error) {
        console.error('글 정보 불러오기 실패:', error)
        showErrorToast('글을 불러오는 데 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.username) {
      fetchPost()
    }
  }, [postId, user?.username, navigate])

  // 에디터 내용 변경 핸들러
  const handleContentChange = content => {
    setContent(content)
  }

  // 폼 제출 핸들러
  const handleSubmit = async e => {
    e.preventDefault()

    // 내용을 입력하지 않아도 수정되는 현상 해결
    const stripHtml = html => html.replace(/<[^>]*>/g, '').trim()

    // 필수 필드 확인
    if (!title || !summary || !stripHtml(content)) {
      showWarnToast('모든 필드를 입력해주세요')
      return
    }
    setIsSubmitting(true)

    try {
      // FormData 생성
      const formData = new FormData()
      formData.set('title', title)
      formData.set('summary', summary)
      formData.set('content', content)

      // 새 파일이 선택된 경우에만 파일 추가
      if (files?.[0]) {
        formData.set('files', files[0])
      }

      // API 호출하여 글 업데이트
      await updatePost(postId, formData)

      // 성공 시 상세 페이지로 이동
      navigate(`/post/${postId}`)
    } catch (error) {
      console.log('글 수정 실패:', error)
      showErrorToast('글 수정에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <main>
      <form className={css.writecon} onSubmit={handleSubmit}>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className={style.title}
        />
        <input
          type="text"
          id="summary"
          name="summary"
          placeholder="요약내용을 입력해주세요"
          value={summary}
          onChange={e => setSummary(e.target.value)}
          className={style.summary}
        />
        <input
          type="file"
          id="files"
          name="files"
          accept="image/*"
          onChange={e => setFiles(e.target.files)}
        />

        {currentImage && (
          <>
            <p className={css.imageNote}>*새 이미지를 업로드하면 기존 이미지는 대체됩니다</p>
            <img src={currentImage} alt="현재 이미지" className={css.previewImage} />
          </>
        )}
        <div className={css.editorWrapper}>
          <QuillEditor
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력해주세요"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className={style.submitBtn}>
          {isSubmitting ? '수정 중...' : '수정하기'}
        </button>
      </form>
    </main>
  )
}
