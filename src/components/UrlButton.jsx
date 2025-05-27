import { useToast } from '../hooks/useToast'

const UrlButton = () => {
  const { showSuccessToast, showErrorToast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showSuccessToast('URL이 복사되었습니다!')
    } catch (error) {
      console.error('URL 복사 실패:', error)
      showErrorToast('복사에 실패했습니다😢')
    }
  }
  return <button onClick={handleCopy}>URL 복사</button>
}

export default UrlButton
