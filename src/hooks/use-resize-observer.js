import { useCallback, useEffect, useRef, useState } from 'react'
import throttle from 'just-throttle'

/**
 * useResizeObserver - observe elements dimensions using ResizeObserver
 * @param {Boolean} lazy - should return a state or not
 * @param {Number} debounce - minimum delay between two ResizeObserver computations
 * @param {String} box - ResizeObserver parameter
 * @param {Function} callback - called on value change
 * @param {Array} deps - props that should trigger a new computation
 */

export function useResizeObserver(
  { lazy = false, debounce = 1000, box = 'border-box', callback = () => {} } = {},
  deps = [],
) {
  const entryRef = useRef({})
  const [entry, setEntry] = useState({})
  const [element, setElement] = useState()

  useEffect(() => {
    if (!element) return

    const onResize = throttle(([entry]) => {
      entryRef.current = entry

      callback(entry)

      if (!lazy) {
        setEntry(entry)
      }
    }, debounce)

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(element, { box })

    return () => {
      resizeObserver.disconnect()
      onResize.cancel()
    }
  }, [element, lazy, debounce, box, ...deps])

  const get = useCallback(() => entryRef.current, [])

  return [setElement, lazy ? get : entry]
}
