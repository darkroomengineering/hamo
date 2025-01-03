import { useEffect, useState } from 'react'
import debounce from 'just-debounce-it'

/**
 * @name useWindowSize
 * @description A React hook that listens to window size.
 * @param {number} debounce- The delay (in milliseconds) before the resize event is processed. This helps to optimize performance by reducing the number of times the callback function is called during resizing. Alternatively, you can set the global `useWindowSize.setDebounce` function to change the default debounce delay.
 * @returns {object} { width, height, dpr }
 */

let defaultDebounceDelay = 500

function setDebounce(delay: number) {
  defaultDebounceDelay = delay
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

    return () => {
      window.removeEventListener('resize', debouncedOnWindowRezise, false)
      debouncedOnWindowRezise.cancel()
    }
  }, [debounceDelay])

  return { width, height, dpr }
}

useWindowSize.setDebounce = setDebounce
