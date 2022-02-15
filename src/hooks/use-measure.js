import { useMemo, useState } from 'react'
import { isBrowser, noop } from '../misc/util'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

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

export const useMeasure = () => {
  const [element, ref] = useState(null)
  const [rect, setRect] = useState(defaultState)

  const observer = useMemo(
    () =>
      new window.ResizeObserver((entries) => {
        if (entries[0]) {
          const { x, y, width, height, top, left, bottom, right } =
            entries[0].contentRect
          setRect({ x, y, width, height, top, left, bottom, right })
        }
      }),
    []
  )

  useIsomorphicLayoutEffect(() => {
    if (!element) return
    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [element])

  return isBrowser && typeof window.ResizeObserver !== 'undefined'
    ? [ref, rect]
    : () => [noop, defaultState]
}
