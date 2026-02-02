import {
  type DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import debounce from 'just-debounce-it'

let defaultDebounceDelay = 500

function setDebounce(delay: number) {
  defaultDebounceDelay = delay
}

/**
 * @name useResizeObserver
 * @description A React hook that listens to element size changes.
 * @param {object} options - The options for the hook.
 * @param {boolean} options.lazy - If true, the resize observer will not trigger state changes.
 * @param {number} options.debounce - The delay (in milliseconds) before the resize event is processed. This helps to optimize performance by reducing the number of times the callback function is called during resizing. Alternatively, you can set the global `useResizeObserver.setDebounce` function to change the default debounce delay.
 * @param {function} options.callback - The callback function to call when the element size changes.
 * @param {array} deps - The dependencies to be used in the callback function.
 * @function setDebounce - A function that allows you to set the debounce delay.
 * @returns {array} [setResizeObserverRef, options.lazy ? getEntryRef : entry]
 */

const callbacksMap = new Map<
  Element,
  ((entry: ResizeObserverEntry) => void)[]
>()

let sharedObserver: ResizeObserver | null = null
function getSharedObserver() {
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
) {
  if (!el) return () => {}

  const debouncedCallback = debounce(callback, debounceDelay, true)

  const callbacks = callbacksMap.get(el) || []
  callbacks.push(debouncedCallback)
  callbacksMap.set(el, callbacks)
  const sharedObserver = getSharedObserver()
  sharedObserver.observe(el)

  return () => {
    const callbacks = callbacksMap.get(el)
    if (callbacks) {
      const index = callbacks.indexOf(debouncedCallback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
      if (callbacks.length === 0) {
        callbacksMap.delete(el)
        sharedObserver.unobserve(el)
      }
    }
    if (callbacksMap.size === 0) {
      sharedObserver.disconnect()
    }
  }
}

export function useResizeObserver<L extends boolean = false>(
  {
    lazy = false as L,
    debounce: debounceDelay = defaultDebounceDelay,
    callback = () => {},
  }: {
    lazy?: L
    debounce?: number
    callback?: (entry: ResizeObserverEntry) => void
  } = {},
  deps: DependencyList = []
): [
  (element: HTMLElement | null) => void,
  L extends true
    ? () => ResizeObserverEntry | undefined
    : ResizeObserverEntry | undefined,
] {
  const [element, setElement] = useState<HTMLElement | null>()
  const [entry, setEntry] = useState<ResizeObserverEntry>()
  const entryRef = useRef<ResizeObserverEntry>()

  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!element) return

    return observeElement(
      element,
      (entry: ResizeObserverEntry) => {
        callbackRef.current(entry)
        entryRef.current = entry
        if (!lazy) {
          setEntry(entry)
        }
      },
      debounceDelay
    )
  }, [element, debounceDelay, lazy, ...deps])

  const getEntryRef = useCallback(() => entryRef.current, [])

  return [setElement, lazy ? getEntryRef : entry] as [
    typeof setElement,
    L extends true
      ? () => ResizeObserverEntry | undefined
      : ResizeObserverEntry | undefined,
  ]
}

useResizeObserver.setDebounce = setDebounce
