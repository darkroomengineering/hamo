import { useCallback, useState } from 'react'
import { useLayoutEffect } from './use-isomorphic-layout-effect'

export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const onResize = useCallback(() => {
    setIsTouchDevice(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    )
  }, [])

  useLayoutEffect(() => {
    onResize()
    window.addEventListener('resize', onResize, false)

    return () => {
      window.removeEventListener('resize', onResize, false)
    }
  }, [])

  return isTouchDevice
}

export default useIsTouchDevice
