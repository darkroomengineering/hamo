import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * @name useIntersectionObserver
 * @description A React hook that oberves element visibility using IntersectionObserver.
 * @param {HTMLElement} root (optional)
 * @param {string} rootMargin (optional, default: `0px`)
 * @param {number} threshold (optional, default: `0`)
 * @param {boolean} once (optional, default: `false`)
 * @param {boolean} lazy (optional, default: `false`)
 * @param {function} callback (optional)
 * @param {array} deps (optional)
 * @returns {array} [setElement, entry]
 */

export function useIntersectionObserver(
  {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    once = false,
    lazy = false,
    callback = () => {},
  }: {
    root?: HTMLElement | null
    rootMargin?: string
    threshold?: number
    once?: boolean
    lazy?: boolean
    callback?: (entry: IntersectionObserverEntry | undefined) => void
  } = {},
  deps = []
) {
  const entryRef = useRef<IntersectionObserverEntry>()
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const [element, setElement] = useState<HTMLElement | null>()

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

        if (once && entry?.isIntersecting) intersection.disconnect()
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

  return [
    setElement,
    (lazy ? get : entry) as IntersectionObserverEntry, // fix type
  ] as const
}
