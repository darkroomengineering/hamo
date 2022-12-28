import { useCallback, useEffect, useRef, useState } from 'react'
import { throttle } from 'throttle-debounce'

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

export function useRect({
  // ignoreTransform = true,
  lazy = false,
  debounce = 1000,
} = {}) {
  const element = useRef()
  const resizeObserver = useRef()

  const [rect, setRect] = useState({})
  const lazyRect = useRef(rect)

  const resize = useCallback(() => {
    if (element.current) {
      const top = offsetTop(element.current)
      const left = offsetLeft(element.current)

      lazyRect.current = { ...lazyRect.current, top, left }
      if (!lazy) {
        setRect(lazyRect.current)
      }
    }
  }, [lazy])

  // resize if body height changes
  useEffect(() => {
    const callback = throttle(debounce, resize)
    const resizeObserver = new ResizeObserver(callback)
    resizeObserver.observe(document.body)

    return () => {
      resizeObserver.disconnect()
      callback.cancel({ upcomingOnly: true })
    }
  }, [debounce, resize])

  const onResizeObserver = useCallback(
    ([entry]) => {
      const { width, height } = entry.contentRect
      // const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0];

      lazyRect.current = { ...lazyRect.current, width, height }
      if (!lazy) {
        setRect(lazyRect.current)
      }
    },
    [lazy]
  )

  const getRect = useCallback(() => lazyRect.current, [])

  useEffect(() => {
    return () => {
      // avoid strict mode double execution
      if (process.env.NODE_ENV !== 'development') {
        // disconnect resizeObserver on unmount
        resizeObserver.current?.disconnect()
      }
    }
  }, [])

  const setRef = useCallback(
    (node) => {
      if (!node || node === element.current) return

      resizeObserver.current?.disconnect()
      resizeObserver.current = new ResizeObserver(onResizeObserver)
      resizeObserver.current.observe(node)
      element.current = node
    },
    [resize]
  )

  return [setRef, lazy ? getRect : rect]
}

export default useRect
