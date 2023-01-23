/**
 * This function allows you to set an interval in a functional component
 * @param {function} callback - The callback function
 * @param {number} delay - The delay between each interval
 */

import { useEffect, useRef } from 'react'

export const useInterval = (callback, delay) => {
  const savedCallback = useRef()
  const intervalId = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (delay !== null) {
      intervalId.current = setInterval(tick, delay)
      return () => clearInterval(intervalId.current)
    }
  }, [delay])

  return () => clearInterval(intervalId.current)
}

export default useInterval
