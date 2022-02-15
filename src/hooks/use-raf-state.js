import { raf } from '@react-spring/rafz'
import { useCallback, useRef, useState } from 'react'
import { useUnmount } from './use-unmount'

export const useRafState = (initialState) => {
  const frame = useRef(0)
  const [state, setState] = useState(initialState)

  const setRafState = useCallback((value) => {
    raf.cancel(frame.current)

    raf(setState(value))
  }, [])

  useUnmount(() => {
    raf.cancel(frame.current)
  })

  return [state, setRafState]
}
