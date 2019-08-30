import { useEffect, useCallback, useState } from 'react'

const handlers = new Set<(value: boolean) => void>()

export function useToggle() {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    handlers.add(setOpen)
    function close() {
      handlers.forEach(handler => handler(false))
    }
    document.addEventListener('mousedown', close)
    return () => {
      handlers.delete(setOpen)
      document.removeEventListener('mousedown', close)
    }
  }, [setOpen])

  const toggle = useCallback(() => setOpen(!isOpen), [isOpen, setOpen])
  const stopPropagation = useCallback(
    (event: React.MouseEvent) => {
      handlers.forEach(handler => {
        if (handler !== setOpen) {
          handler(false)
        }
      })
      event.nativeEvent.stopImmediatePropagation()
    },
    [setOpen]
  )

  return { isOpen, toggle, stopPropagation }
}
