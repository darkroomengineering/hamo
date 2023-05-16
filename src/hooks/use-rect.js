import { useCallback, useEffect, useRef, useState } from 'react'
import { throttle } from 'throttle-debounce'
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

export function useRect(
  {
    // ignoreTransform = true,
    lazy = false,
    debounce = 1000,
  } = {},
  deps = []
) {
  const [element, setElement] = useState()
  const [rect, setRect] = useState({})
  const rectRef = useRef({})
  const [setResizeObserverElement] = useResizeObserver(
    {
      lazy: true,
      callback: (entry) => {
        // includes padding and border
        const width = entry.borderBoxSize[0].inlineSize
        const height = entry.borderBoxSize[0].blockSize

        if (lazy) {
          rectRef.current.width = width
          rectRef.current.height = height
        } else {
          setRect((rect) => ({
            ...rect,
            width,
            height,
          }))
        }
      },
    },
    [lazy, ...deps]
  )

  // resize if body height changes
  useEffect(() => {
    if (!element) return

    const callback = throttle(debounce, () => {
      // TODO: ignoreTransform: true/false
      // ignoreTransform: true rely on offset technique
      // ignoreTransform: false rely on getBoundingClientRect
      const top = offsetTop(element)
      const left = offsetLeft(element)

      if (lazy) {
        rectRef.current.top = top
        rectRef.current.left = left
      } else {
        setRect((rect) => ({
          ...rect,
          top,
          left,
        }))
      }
    })
    const resizeObserver = new ResizeObserver(callback)
    resizeObserver.observe(document.body, { box: 'border-box' })

    return () => {
      resizeObserver.disconnect()
      callback.cancel()
    }
  }, [element, lazy, debounce])

  const getRect = useCallback(() => rectRef.current, [])

  return [
    (node) => {
      setElement(node)
      setResizeObserverElement(node)
    },
    lazy ? getRect : rect,
  ]
}
