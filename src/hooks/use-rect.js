import { useCallback, useEffect, useRef, useState } from 'react'
import throttle from 'just-throttle'
import { useResizeObserver } from './use-resize-observer'

// offsetTop function returns the offsetTop value of a DOM element.
// The offsetTop value is the distance between the top of the element
// and the top of the viewport.
export function offsetTop(element, accumulator = 0) {
  const top = accumulator + element.offsetTop
  if (element.offsetParent) {
    return offsetTop(element.offsetParent, top)
  }
  return top
}

// offsetLeft function returns the offsetLeft value of a DOM element.
// The offsetLeft value is the distance between the left of the element
// and the left of the viewport.
export function offsetLeft(element, accumulator = 0) {
  const left = accumulator + element.offsetLeft
  if (element.offsetParent) {
    return offsetLeft(element.offsetParent, left)
  }
  return left
}

/**
 * useRect - observe elements BoundingRect
 * @param {boolean} ignoreTransform - should include transform in the returned rect or not
 * @param {boolean} lazy - should return a state or not
 * @param {number} debounce - minimum delay between two rect computations
 * @param {number} resizeDebounce - minimum delay between two ResizeObserver computations
 * @param {Function} callback - called on value change
 * @param {Array} deps - props that should trigger a new rect computation
 */

export function useRect(
  { ignoreTransform = false, lazy = false, debounce = 1000, resizeDebounce = debounce, callback = () => {} } = {},
  deps = [],
) {
  const [element, setElement] = useState()
  const [rect, setRect] = useState({})
  const rectRef = useRef({})
  const [setResizeObserverElement] = useResizeObserver(
    {
      lazy: true,
      debounce: resizeDebounce,
      callback: (entry) => {
        // includes padding and border
        const width = entry.borderBoxSize[0].inlineSize
        const height = entry.borderBoxSize[0].blockSize

        rectRef.current.width = width
        rectRef.current.height = height

        callback(rectRef.current)

        if (!lazy) {
          setRect((rect) => ({
            ...rect,
            width,
            height,
          }))
        }
      },
    },
    [lazy, resizeDebounce, ...deps],
  )

  // resize if body height changes
  useEffect(() => {
    if (!element) return

    const onBodyResize = throttle(() => {
      let top, left

      if (ignoreTransform) {
        top = offsetTop(element)
        left = offsetLeft(element)
      } else {
        const rect = element.getBoundingClientRect()
        top = rect.top + window.scrollY
        left = rect.left + window.scrollX
      }

      rectRef.current.top = top
      rectRef.current.left = left

      callback(rectRef.current)

      if (!lazy) {
        setRect((rect) => ({
          ...rect,
          top,
          left,
        }))
      }
    }, debounce)
    const resizeObserver = new ResizeObserver(onBodyResize)
    resizeObserver.observe(document.body)

    return () => {
      resizeObserver.disconnect()
      onBodyResize.cancel()
    }
  }, [element, lazy, debounce, ignoreTransform, ...deps])

  const getRect = useCallback(() => rectRef.current, [])

  return [
    (node) => {
      setElement(node)
      setResizeObserverElement(node)
    },
    lazy ? getRect : rect,
  ]
}
