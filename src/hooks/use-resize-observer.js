import { useCallback, useEffect, useRef, useState } from 'react'
import { throttle } from 'throttle-debounce'

export function useResizeObserver({ lazy = false, box = 'border-box', callback = () => {} } = {}, deps = []) {
  const entryRef = useRef({})
  const [entry, setEntry] = useState({})
  const [element, setElement] = useState()

  useEffect(() => {
    if (!element) return

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (lazy) {
        entryRef.current = entry
      } else {
        setEntry(entry)
      }

      callback(entry)
    })
    resizeObserver.observe(element, { box })

    return () => {
      resizeObserver.disconnect()
    }
  }, [element, lazy, box, ...deps])

  const get = useCallback(() => entryRef.current, [])

  return [setElement, lazy ? get : entry]
}
