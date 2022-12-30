import { useCallback, useState, useEffect } from 'react'
import { isClient } from '../utils'

const useIsTouchDevice = () => {
  const check = useCallback(
    () =>
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0,
    []
  )

  const [isTouchDevice, setIsTouchDevice] = useState(check())

  const onResize = useCallback(() => {
    setIsTouchDevice(check())
  }, [check])

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize, { passive: true })
    }
  }, [onResize])

  return isTouchDevice
}

export default isClient ? useIsTouchDevice : () => undefined
