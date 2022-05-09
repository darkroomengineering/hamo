import { useLayoutEffect, useState } from 'react'

export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(undefined)

  useLayoutEffect(() => {
    const onResize = () => {
      setIsTouchDevice(
        // @ts-ignore
        'ontouchstart' in window ||
          // @ts-ignore
          navigator.maxTouchPoints > 0 ||
          // @ts-ignore
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
