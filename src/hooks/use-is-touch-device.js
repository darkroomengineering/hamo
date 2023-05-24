/*
  This hook checks if the device has a touch screen. It checks for the touchstart event,
  as well as the maxTouchPoints property on the navigator object. It also checks the
  msMaxTouchPoints property, which is specific to Microsoft browsers.
*/

import { useEffect, useState } from 'react'

/**
 * @name useIsTouchDevice
 * @description A React hook that detects if the device supports touch.
 * @returns {boolean} Whether the device supports touch or not.
 */

export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState()

  useEffect(() => {
    function onResize() {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)
    }

    window.addEventListener('resize', onResize, false)
    onResize()

    return () => {
      window.removeEventListener('resize', onResize, false)
    }
  }, [])

  return isTouchDevice
}
