import { useEffect, useState } from 'react'

/**
 * @name useWindowSize
 * @description A React hook that listens to window size.
 * @returns {object} { width, height }
 */

export function useWindowSize() {
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()

  useEffect(() => {
    function onWindowRezise() {
      setWidth(Math.min(window.innerWidth, document.documentElement.clientWidth))
      setHeight(Math.min(window.innerHeight, document.documentElement.clientHeight))
    }

    window.addEventListener('resize', onWindowRezise, false)

    onWindowRezise()

    return () => window.removeEventListener('resize', onWindowRezise, false)
  }, [])

  return { width, height }
}
