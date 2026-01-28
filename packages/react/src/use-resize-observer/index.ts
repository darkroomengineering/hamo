import { useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'just-debounce-it'

let defaultDebounceDelay = 500

function setDebounce(delay: number) {
  defaultDebounceDelay = delay
}

const callbacksMap = new Map<
  Element,
  ((entry: ResizeObserverEntry) => void)[]
>()

let sharedObserver: ResizeObserver | null = null

function getSharedObserver(): ResizeObserver | null {
  // SSR safety check
  if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') {
    return null
  }

  if (!sharedObserver) {
    sharedObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const callbacks = callbacksMap.get(entry.target)
        if (callbacks) {
          for (const cb of callbacks) {
            cb(entry)
          }
        }
      }
    })
  }
  return sharedObserver
}

function observeElement(
  el: Element,
  callback: (entry: ResizeObserverEntry) => void,
  debounceDelay: number = defaultDebounceDelay
): () => void {
  if (!el) return () => {}

  const observer = getSharedObserver()
  if (!observer) return () => {}

  const debouncedCallback = debounce(callback, debounceDelay, true)

  const callbacks = callbacksMap.get(el) || []
  callbacks.push(debouncedCallback)
  callbacksMap.set(el, callbacks)
  observer.observe(el)

  return () => {
    const callbacks = callbacksMap.get(el)
    if (callbacks) {
      const index = callbacks.indexOf(debouncedCallback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
      if (callbacks.length === 0) {
        callbacksMap.delete(el)
        observer.unobserve(el)
      }
    }
    if (callbacksMap.size === 0) {
      observer.disconnect()
      sharedObserver = null
    }
  }
}

type UseResizeObserverOptions<L extends boolean = false> = {
  lazy?: L
  debounce?: number
  callback?: (entry: ResizeObserverEntry) => void
}

type UseResizeObserverReturn<L extends boolean> = [
  (element: HTMLElement | null) => void,
  L extends true ? () => ResizeObserverEntry | undefined : ResizeObserverEntry | undefined,
]

/**
 * @name useResizeObserver
 * @description A React hook that observes element size changes using a shared ResizeObserver instance.
 * @param {object} options - The options for the hook.
 * @param {boolean} options.lazy - If true, returns a getter function instead of triggering re-renders on size changes.
 * @param {number} options.debounce - The delay (in milliseconds) before the resize event is processed.
 * @param {function} options.callback - The callback function to call when the element size changes.
 * @returns {array} [setElement, lazy ? getEntry : entry]
 */
export function useResizeObserver<L extends boolean = false>(
  options: UseResizeObserverOptions<L> = {}
): UseResizeObserverReturn<L> {
  const { lazy = false as L, debounce: debounceDelay = defaultDebounceDelay, callback } = options

  const [element, setElement] = useState<HTMLElement | null>(null)
  const [entry, setEntry] = useState<ResizeObserverEntry | undefined>(undefined)
  const entryRef = useRef<ResizeObserverEntry | undefined>(undefined)

  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!element) return

    return observeElement(
      element,
      (entry: ResizeObserverEntry) => {
        callbackRef.current?.(entry)
        entryRef.current = entry
        if (!lazy) {
          setEntry(entry)
        }
      },
      debounceDelay
    )
  }, [element, debounceDelay, lazy])

  const getEntryRef = useCallback(() => entryRef.current, [])

  return [setElement, lazy ? getEntryRef : entry] as UseResizeObserverReturn<L>
}

useResizeObserver.setDebounce = setDebounce
