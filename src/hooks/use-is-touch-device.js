/*
  This hook checks if the device has a touch screen. It checks for the touchstart event,
  as well as the maxTouchPoints property on the navigator object. It also checks the
  msMaxTouchPoints property, which is specific to Microsoft browsers.
*/

import { useCallback, useEffect, useState } from 'react'

export function useIsTouchDevice() {
  const check = useCallback(
    () => 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0,
    []
  )

  const [isTouchDevice, setIsTouchDevice] = useState(undefined)

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
