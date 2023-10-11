import { useEffect, useState } from 'react'
import debounce from 'just-debounce-it'

/**
 * @name useWindowSize
 * @description A React hook that listens to window size.
 * @returns {object} { width, height }
 */

export function useWindowSize(debounceDelay = 500) {
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()

  useEffect(() => {
    const onWindowRezise = debounce(
      () => {
        setWidth(Math.min(window.innerWidth, document.documentElement.clientWidth))
        setHeight(Math.min(window.innerHeight, document.documentElement.clientHeight))
      },
      debounceDelay,
      true,
    )

    window.addEventListener('resize', onWindowRezise, false)

    onWindowRezise()

    return () => window.removeEventListener('resize', onWindowRezise, false)
  }, [debounceDelay])

  return { width, height }
}
