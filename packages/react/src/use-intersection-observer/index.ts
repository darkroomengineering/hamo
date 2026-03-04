import { useCallback, useEffect, useRef, useState } from 'react'
import { type ObserverHookReturn, useLatestCallback } from '../shared'

type UseIntersectionObserverOptions<L extends boolean = false> = {
  root?: HTMLElement | null
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
  lazy?: L
  callback?: (entry: IntersectionObserverEntry) => void
}

/**
 * @name useIntersectionObserver
 * @description A React hook that observes element visibility using IntersectionObserver.
 * @param {object} options - The options for the hook.
 * @param {HTMLElement} options.root - The element used as the viewport for checking visibility.
 * @param {string} options.rootMargin - Margin around the root element.
 * @param {number|number[]} options.threshold - Percentage of visibility required to trigger.
 * @param {boolean} options.once - If true, disconnects after first intersection.
 * @param {boolean} options.lazy - If true, returns a getter function instead of triggering re-renders.
 * @param {function} options.callback - The callback function to call on intersection changes.
 * @returns {array} [setElement, lazy ? getEntry : entry]
 */
export function useIntersectionObserver<L extends boolean = false>(
  options: UseIntersectionObserverOptions<L> = {}
): ObserverHookReturn<IntersectionObserverEntry, L> {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    once = false,
    lazy = false as L,
    callback,
  } = options

  const entryRef = useRef<IntersectionObserverEntry | undefined>(undefined)
  const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>(
    undefined
  )
  const [element, setElement] = useState<HTMLElement | null>(null)

  const callbackRef = useLatestCallback(callback)

  useEffect(() => {
    // SSR safety check
    if (
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return
    }

    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const observerEntry = entries[0]
        if (!observerEntry) return

        if (lazy) {
          entryRef.current = observerEntry
        } else {
          setEntry(observerEntry)
        }

        callbackRef.current?.(observerEntry)

        if (once && observerEntry.isIntersecting) {
          observer.disconnect()
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [element, root, rootMargin, threshold, lazy, once, callbackRef])

  const getEntry = useCallback(() => entryRef.current, [])

  return [setElement, lazy ? getEntry : entry] as ObserverHookReturn<
    IntersectionObserverEntry,
    L
  >
}
