import { toast } from 'react-toastify'
import { Bounce } from 'react-toastify'

export const useToast = () => {
  const isMobile = window.innerWidth < 768

  const showSuccessToast = (message, options = {}) => {
    if (isMobile) return
    toast.success(message, {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      transition: Bounce,
    })
  }
  const showErrorToast = (message, options = {}) => {
    if (isMobile) return
    toast.error(message, {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    })
  }
  const showDefaultToast = (message, options = {}) => {
    if (isMobile) return
    toast(message, {
      position: 'bottom-right',
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: false,
      progress: undefined,
      pauseOnHover: false,
      theme: 'dark',
      transition: Bounce,
      style: { width: '350px' },
    })
  }

  const showWarnToast = (message, options = {}) => {
    if (isMobile) return
    toast.error(message, {
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      transition: Bounce,
    })
  }
  return { showSuccessToast, showErrorToast, showDefaultToast, showWarnToast }
}
