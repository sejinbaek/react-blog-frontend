import { toast } from 'react-toastify'
import { Bounce } from 'react-toastify'

export const useToast = () => {
  const showSuccessToast = (message, options = {}) => {
    toast.success(message, {
      position: 'top-center',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    })
  }
  const showErrorToast = (message, options = {}) => {
    toast.error(message, {
      position: 'top-center',
      autoClose: 2000,
      theme: 'light',
      transition: Bounce,
    })
  }
  return { showSuccessToast, showErrorToast }
}
