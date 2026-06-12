import { createContext, useContext, useRef, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ msg: '', color: '', show: false })
  const timer = useRef(null)

  function showToast(msg, color = 'var(--green)', textColor = 'var(--bg)') {
    clearTimeout(timer.current)
    setToast({ msg, color, textColor, show: true })
    timer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3200)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className={`toast${toast.show ? ' show' : ''}`}
        style={{ background: toast.color, color: toast.textColor }}
      >
        {toast.msg}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
