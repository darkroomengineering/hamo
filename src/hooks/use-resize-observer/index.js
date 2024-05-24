import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import debounce from 'just-debounce-it'

/**
 * useResizeObserver - observe elements dimensions using ResizeObserver
 * @param {Boolean} lazy - should return a state or not
 * @param {Number} debounce - minimum delay between two ResizeObserver computations
 * @param {String} box - ResizeObserver parameter
 * @param {Function} callback - called on value change
 */

export function useResizeObserver({
  lazy = false,
  debounce: debounceDelay = 500,
  box = 'border-box',
  callback = () => {},
} = {}) {
  const entryRef = useRef({})
  const [entry, setEntry] = useState({})
  const [element, setElement] = useState()
  const needsUpdateRef = useRef(false)

  const debouncedSetEntry = useMemo(() => debounce(setEntry, debounceDelay), [debounceDelay])

  const onResize = useCallback(
    ([entry]) => {
      entryRef.current = entry

      callback(entry)

      if (!lazy) {
        if (needsUpdateRef.current) {
          setEntry(entry)
        } else {
          debouncedSetEntry(entry)
        }
      }

      needsUpdateRef.current = false
    },
    [lazy, debouncedSetEntry],
  )

  useEffect(() => {
    if (!element) return

    needsUpdateRef.current = true // set to true to force update on first render when element has changed

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(element, { box })

    return () => {
      resizeObserver.disconnect()
      debouncedSetEntry.cancel()
    }
  }, [element, debounceDelay, box, onResize, debouncedSetEntry])

  const get = useCallback(() => entryRef.current, [])

  return [setElement, lazy ? get : entry]
}
