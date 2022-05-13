import { useEffect } from 'react'
import { isBrowser, off, on } from '../misc/util'
import { useFrame } from './use-frame'

export const useWindowSize = (initialWidth = Infinity, initialHeight = Infinity) => {
  const [state, setState] = useFrame({
    width: isBrowser ? window.innerWidth : initialWidth,
    height: isBrowser ? window.innerHeight : initialHeight,
  })

  useEffect(() => {
    if (isBrowser) {
      const handler = () => {
        setState({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      on(window, 'resize', handler)

      return () => {
        off(window, 'resize', handler)
      }
    }
  }, [])

  return state
}

export default useWindowSize