/**
 * This function allows you to set an interval in a functional component
 * @param {function} callback - The callback function
 * @param {number} delay - The delay between each interval
 */

import { useEffect } from 'react'

export function useInterval(callback, delay = 1000, deps = []) {
  useEffect(() => {
    const interval = setInterval(callback, delay)
    return () => clearInterval(interval)
  }, [delay, ...deps])
}
