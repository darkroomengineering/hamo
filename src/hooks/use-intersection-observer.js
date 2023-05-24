import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * @name useIntersectionObserver
 * @description A React hook that oberves element visibility using IntersectionObserver.
 * @param {HTMLElement} root
 * @param {string} rootMargin
 * @param {number} threshold
 * @param {boolean} once
 * @param {boolean} lazy
 * @param {function} callback
 * @param {array} deps
 * @returns {array} [setElement, entry]
 */

export function useIntersectionObserver(
  { root = null, rootMargin = '0px', threshold = 0, once = false, lazy = false, callback = () => {} } = {},
  deps = []
) {
  const entryRef = useRef({})
  const [entry, setEntry] = useState({})
  const [element, setElement] = useState()

  useEffect(() => {
    if (!element) return

    const intersection = new IntersectionObserver(
      ([entry]) => {
        if (lazy) {
          entryRef.current = entry
        } else {
          setEntry(entry)
        }

        callback(entry)

        if (once && entry.isIntersecting) intersection.disconnect()
      },
      {
        root,
        rootMargin,
        threshold,
      }
    )
    intersection.observe(element)

    return () => {
      intersection.disconnect()
    }
  }, [element, root, rootMargin, threshold, lazy, once, ...deps])

  const get = useCallback(() => entryRef.current, [])

  return [setElement, lazy ? get : entry]
}
