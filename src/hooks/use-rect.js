import { useResizeObserver } from './use-resize-observer'
import debounce from 'just-debounce-it'
import { useCallback, useEffect, useRef, useState } from 'react'

function removeParentSticky(element) {
  const position = getComputedStyle(element).position

  const isSticky = position === 'sticky'

  if (isSticky) {
    element.style.setProperty('position', 'static')
    element.dataset.sticky = 'true'
  }

  if (element.offsetParent) {
    removeParentSticky(element.offsetParent)
  }
}

function addParentSticky(element) {
  if (element?.dataset?.sticky === 'true') {
    element.style.removeProperty('position')
    element.dataset.sticky = 'true'
    delete element.dataset.sticky
  }

  if (element.parentNode) {
    addParentSticky(element.parentNode)
  }
}

export function offsetTop(element, accumulator = 0) {
  const top = accumulator + element.offsetTop
  if (element.offsetParent) {
    return offsetTop(element.offsetParent, top)
  }
  return top
}

export function offsetLeft(element, accumulator = 0) {
  const left = accumulator + element.offsetLeft
  if (element.offsetParent) {
    return offsetLeft(element.offsetParent, left)
  }
  return left
}

export function scrollTop(element, accumulator = 0) {
  const top = accumulator + element.scrollTop
  if (element.offsetParent) {
    return scrollTop(element.offsetParent, top)
  }
  return top + window.scrollY
}

export function scrollLeft(element, accumulator = 0) {
  const left = accumulator + element.scrollLeft
  if (element.offsetParent) {
    return scrollLeft(element.offsetParent, left)
  }
  return left + window.scrollX
}

/**
 * useRect - observe elements BoundingRect
 * @param {boolean} ignoreTransform - should include transform in the returned rect or not
 * @param {boolean} ignoreSticky - should ingnore parent sticky elements or not
 * @param {boolean} lazy - should return a state or a getter
 * @param {number} debounce - minimum delay between two rect computations
 * @param {number} resizeDebounce - minimum delay between two ResizeObserver computations
 * @param {Function} callback - called on value change
 * @param {Array} deps - props that should trigger a new rect computation
 */

export function useRect(
  {
    ignoreTransform = false,
    ignoreSticky = true,
    lazy = false,
    debounce: debounceDelay = 500,
    resizeDebounce = debounceDelay,
    callback = () => {},
  } = {},
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

    const onBodyResize = debounce(
      () => {
        let top, left

        if (ignoreSticky) removeParentSticky(element)
        if (ignoreTransform) {
          top = offsetTop(element)
          left = offsetLeft(element)
        } else {
          const rect = element.getBoundingClientRect()
          top = rect.top + scrollTop(element)
          left = rect.left + scrollLeft(element)
        }
        if (ignoreSticky) addParentSticky(element)

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
      },
      debounceDelay,
      true,
    )
    const resizeObserver = new ResizeObserver(onBodyResize)
    resizeObserver.observe(document.body)

    return () => {
      resizeObserver.disconnect()
      onBodyResize.cancel()
    }
  }, [element, lazy, debounceDelay, ignoreTransform, ignoreSticky, ...deps])

  const getRect = useCallback(() => rectRef.current, [])

  return [
    (node) => {
      setElement(node)
      setResizeObserverElement(node)
    },
    lazy ? getRect : rect,
  ]
}
