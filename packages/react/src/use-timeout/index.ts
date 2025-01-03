import { useEffect, useRef, useState } from 'react'

/**
 * @name useTimeout
 * @description
 * A hook that allows you to set a timeout.
 * @param {function} callback - The callback function to be executed after the delay.
 * @param {number} delay - The delay (in milliseconds) before the callback function is executed.
 * @param {array} deps - The dependencies array for the hook.
 */

export function useTimeout(
  callback: () => void,
  delay: number,
  deps: any[] = []
) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const timeout = setTimeout(callbackRef.current, delay)

    return () => clearTimeout(timeout)
  }, [delay, ...deps])
}
