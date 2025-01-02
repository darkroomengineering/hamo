import { useEffect, useState } from 'react'
import debounce from 'just-debounce-it'

/**
 * @name useWindowSize
 * @description A React hook that listens to window size.
 * @returns {object} { width, height, dpr }
 */

let defaultDebounceDelay = 500

function setDebounceDelay(debounceDelay: number) {
  defaultDebounceDelay = debounceDelay
}

export function useWindowSize(debounceDelay: number = defaultDebounceDelay) {
  const [width, setWidth] = useState<number>()
  const [height, setHeight] = useState<number>()
  const [dpr, setDpr] = useState<number>()

  useEffect(() => {
    function onWindowResize() {
      setWidth(
        Math.min(window.innerWidth, document.documentElement.clientWidth)
      )
      setHeight(
        Math.min(window.innerHeight, document.documentElement.clientHeight)
      )
      setDpr(window.devicePixelRatio)
    }

    const debouncedOnWindowRezise = debounce(onWindowResize, debounceDelay)

    window.addEventListener('resize', debouncedOnWindowRezise, false)

    onWindowResize()

    return () =>
      window.removeEventListener('resize', debouncedOnWindowRezise, false)
  }, [debounceDelay])

  return { width, height, dpr }
}

useWindowSize.setDebounceDelay = setDebounceDelay
