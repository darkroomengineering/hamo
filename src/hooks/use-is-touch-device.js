/*
  This hook checks if the device has a touch screen. It checks for the touchstart event,
  as well as the maxTouchPoints property on the navigator object. It also checks the
  msMaxTouchPoints property, which is specific to Microsoft browsers.
*/

import { useCallback, useEffect, useState } from 'react'
import { useIsClient } from './use-is-client'

export function useIsTouchDevice() {
  const isClient = useIsClient()
  const check = useCallback(() => {
    try {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    } catch (error) {
      return false
    }
  }, [])

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

  return isClient ? isTouchDevice : undefined
}
