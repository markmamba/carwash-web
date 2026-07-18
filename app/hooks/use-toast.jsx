import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'

const ToastContext = createContext({
  showToast : () => { }
})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((toastConfig) => {
    const id = `${Date.now()}-${Math.random()}`

    setToasts((currentToasts) => [
      ...currentToasts,
      {
        id,
        title   : toastConfig.title,
        message : toastConfig.message,
        type    : toastConfig.type || 'danger'
      }
    ])
  }, [])

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId))
  }, [])

  const toastContextValue = useMemo(() => ({
    showToast
  }), [showToast])

  return (
    <ToastContext.Provider value={ toastContextValue }>
      { children }

      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1080 }}
      >
        {
          toasts.map((toast) => (
            <Toast
              key={ toast.id }
              bg={ toast.type }
              onClose={ () => dismissToast(toast.id) }
              show
              delay={ 6000 }
              autohide
            >
              {
                toast.title
                  ? (
                    <Toast.Header closeButton>
                      <strong className="me-auto">
                        { toast.title }
                      </strong>
                    </Toast.Header>
                  )
                  : null
              }
              <Toast.Body className={ toast.type === 'danger' || toast.type === 'success' ? 'text-white' : undefined }>
                { toast.message }
              </Toast.Body>
            </Toast>
          ))
        }
      </ToastContainer>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}
