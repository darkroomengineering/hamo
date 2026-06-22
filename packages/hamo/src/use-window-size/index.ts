'use client'

import { useEffect, useState } from 'react'
import { createDebounceConfig } from '../debounce-config'
import { debounce } from '../use-debounce'

/**
 * @name useWindowSize
 * @description A React hook that listens to window size.
 * @param {number} debounce- The delay (in milliseconds) before the resize event is processed. This helps to optimize performance by reducing the number of times the callback function is called during resizing. Alternatively, you can set the global `useWindowSize.setDebounce` function to change the default debounce delay.
 * @returns {object} { width, height, dpr }
 */

const windowSizeDebounce = createDebounceConfig()

function windowSize(
  callback: ({
    width,
    height,
    dpr,
  }: {
    width: number
    height: number
    dpr: number
  }) => void,
  debounceDelay: number = windowSizeDebounce.getDelay()
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

  onWindowResize()

  return () => {
    abortController.abort()
    debouncedOnWindowRezise.cancel()
  }
}

type WindowSize = { width?: number; height?: number; dpr?: number }

export function useWindowSize(
  debounceDelay: number = windowSizeDebounce.getDelay()
) {
  const [size, setSize] = useState<WindowSize>({})

  useEffect(() => {
    return windowSize((next) => setSize(next), debounceDelay)
  }, [debounceDelay])

  return size
}

useWindowSize.setDebounce = windowSizeDebounce.setDebounce
