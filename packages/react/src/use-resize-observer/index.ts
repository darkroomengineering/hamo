import { useCallback, useEffect, useRef, useState } from 'react'
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
 * @param {object} options.options - The options to pass to the `ResizeObserver.observe` method. See [ResizeObserver.observe options](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe#options) for more information.
 * @param {function} options.callback - The callback function to call when the element size changes.
 * @param {array} deps - The dependencies to be used in the callback function.
 * @returns {array} [setResizeObserverRef, resizeObserver]
 */

export function useResizeObserver(
  {
    lazy = false,
    debounce: debounceDelay = defaultDebounceDelay,
    options = {},
    callback = () => {},
  }: {
    lazy?: boolean
    debounce?: number
    options?: ResizeObserverOptions
    callback?: (entry: ResizeObserverEntry | undefined) => void
  } = {},
  deps: any[] = []
) {
  const [element, setElement] = useState<HTMLElement | null>()
  const [entry, setEntry] = useState<ResizeObserverEntry>()
  const entryRef = useRef<ResizeObserverEntry>()

  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!element) return

    let immediate = true

    function emit(entry: ResizeObserverEntry) {
      callbackRef.current(entry)
      entryRef.current = entry

      if (!lazy) {
        setEntry(entry)
      }
    }

    const debouncedEmit = debounce(emit, debounceDelay)

    function onResize(entries: ResizeObserverEntry[]) {
      const entry = entries[0]

      if (entry) {
        if (immediate) {
          emit(entry)
        } else {
          debouncedEmit(entry)
        }

        immediate = false
      }
    }

    const resizeObserver = new ResizeObserver(onResize)

    resizeObserver.observe(element, options)

    return () => {
      resizeObserver.disconnect()
    }
  }, [element, debounceDelay, lazy, JSON.stringify(options), ...deps])

  const getEntryRef = useCallback(() => entryRef.current, [])

  return [setElement, lazy ? getEntryRef : entry] as const
}

useResizeObserver.setDebounce = setDebounce
