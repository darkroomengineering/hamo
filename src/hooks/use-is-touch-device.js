import { useCallback, useState } from 'react'
import { useLayoutEffect } from './use-isomorphic-layout-effect'

export const useIsTouchDevice = () => {
  const checkTouchDevice = useCallback(
    () =>
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0),
    []
  )

  const [isTouchDevice, setIsTouchDevice] = useState(checkTouchDevice())

  const onResize = useCallback(() => {
    setIsTouchDevice(checkTouchDevice())
  }, [checkTouchDevice])

  useLayoutEffect(() => {
    onResize()
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize, { passive: true })
    }
  }, [onResize])

  return isTouchDevice
}

export default useIsTouchDevice
