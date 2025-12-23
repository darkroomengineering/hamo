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

function windowSize(
  callback: ({
    width,
    height,
    dpr,
  }: { width: number; height: number; dpr: number }) => void,
  debounceDelay: number = defaultDebounceDelay
) {
  function onWindowResize() {
    const width = Math.min(
      window.innerWidth,
      document.documentElement.clientWidth
    )
    const height = Math.min(
      window.innerHeight,
      document.documentElement.clientHeight
    )
    const dpr = window.devicePixelRatio
    callback({ width, height, dpr })
  }
  const debouncedOnWindowRezise = debounce(onWindowResize, debounceDelay)

  const abortController = new AbortController()
  window.addEventListener('resize', debouncedOnWindowRezise, {
    signal: abortController.signal,
  })

  return () => {
    abortController.abort()
    debouncedOnWindowRezise.cancel()
  }
}

export function useWindowSize(debounceDelay: number = defaultDebounceDelay) {
  const [width, setWidth] = useState<number>()
  const [height, setHeight] = useState<number>()
  const [dpr, setDpr] = useState<number>()

  useEffect(() => {
    return windowSize(({ width, height, dpr }) => {
      setWidth(width)
      setHeight(height)
      setDpr(dpr)
    }, debounceDelay)
  }, [debounceDelay])

  return { width, height, dpr }
}

useWindowSize.setDebounce = setDebounce
