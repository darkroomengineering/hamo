'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * @name useIntersectionObserver
 * @description A React hook that observes element visibility using IntersectionObserver.
 * @param {Element | Document} root (optional)
 * @param {string} rootMargin (optional, default: `0px`)
 * @param {number | number[]} threshold (optional, default: `0`)
 * @param {boolean} once (optional, default: `false`)
 * @param {boolean} lazy (optional, default: `false`)
 * @param {function} callback (optional)
 * @param {array} deps (optional)
 * @returns {array} [setElement, lazy ? getEntry : entry]
 */

export function useIntersectionObserver<L extends boolean = false>(
  {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    once = false,
    lazy = false as L,
    callback = () => {},
  }: {
    root?: Element | Document | null
    rootMargin?: string
    threshold?: number | number[]
    once?: boolean
    lazy?: L
    callback?: (entry: IntersectionObserverEntry | undefined) => void
  } = {},
  deps: any[] = []
): [
  (element: HTMLElement | null) => void,
  L extends true
    ? () => IntersectionObserverEntry | undefined
    : IntersectionObserverEntry | undefined,
] {
  const entryRef = useRef<IntersectionObserverEntry | undefined>(undefined)
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const [element, setElement] = useState<HTMLElement | null>(null)

  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!element) return

    const intersection = new IntersectionObserver(
      ([entry]) => {
        if (lazy) {
          entryRef.current = entry
        } else {
          setEntry(entry)
        }

        callbackRef.current(entry)

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

  const getEntry = useCallback(() => entryRef.current, [])

  return [setElement, lazy ? getEntry : entry] as [
    (element: HTMLElement | null) => void,
    L extends true
      ? () => IntersectionObserverEntry | undefined
      : IntersectionObserverEntry | undefined,
  ]
}
