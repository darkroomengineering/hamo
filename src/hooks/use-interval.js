/**
 * This function allows you to set an interval in a functional component
 * @param {function} callback - The callback function
 * @param {number} delay - The delay between each interval
 */

import { useEffect, useRef } from 'react'

export function useInterval(callback, delay) {
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
<<<<<<< HEAD
=======

  return () => clearInterval(intervalId.current)
}
>>>>>>> 77f4ee0 (updates)

  return () => clearInterval(intervalId.current)
}
