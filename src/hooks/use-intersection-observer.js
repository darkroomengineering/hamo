import { useCallback, useEffect, useRef, useState } from 'react'

export function useIntersectionObserver({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  once = false,
  lazy = false,
  callback = () => {},
  deps = [],
} = {}) {
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
