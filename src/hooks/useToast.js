import { toast } from 'react-toastify'
import { Bounce } from 'react-toastify'

export const useToast = () => {
  const showSuccessToast = (message, options = {}) => {
    toast(message, {
      position: 'top-center',
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      transition: Bounce,
    })
  }
  const showErrorToast = (message, options = {}) => {
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
