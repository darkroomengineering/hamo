import { useState } from 'react'
import { useLayoutEffect } from './use-isomorphic-layout-effect'

export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState()

  useLayoutEffect(() => {
    const onResize = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      )
    }

    onResize()
    window.addEventListener('resize', onResize, false)

    return () => {
      window.removeEventListener('resize', onResize, false)
    }
  }, [])

  return isTouchDevice
}

export default useIsTouchDevice
