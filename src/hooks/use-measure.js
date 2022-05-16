import { useMemo, useState } from 'react'
import { useLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import { isBrowser, noop } from '../misc/util'


const defaultState = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}

export function useMeasure() {
  const [element, ref] = useState(null)
  const [rect, setRect] = useState(defaultState)

  const observer = useMemo(
    () =>
      new (window).ResizeObserver((entries) => {
        if (entries[0]) {
          const { x, y, width, height, top, left, bottom, right } = entries[0].contentRect
          setRect({ x, y, width, height, top, left, bottom, right })
        }
      }),
    []
  )

  useLayoutEffect(() => {
    if (!element) return
    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [element])

  return [ref, rect]
}

export default isBrowser && typeof (window).ResizeObserver !== 'undefined'
  ? useMeasure
  : ((() => [noop, defaultState]))