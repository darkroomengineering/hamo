import { raf } from '@react-spring/rafz'
import { useId } from 'react'
import { useLayoutEffect } from './use-isomorphic-layout-effect'
// https://github.com/pmndrs/react-spring/tree/master/packages/rafz#readme
const callbacks = {}

raf.onFrame(() => {
  Object.entries(callbacks)
    // @ts-ignore
    .sort((a, b) => a[1].priority - b[1].priority)
    // @ts-ignore
    .forEach(([, { callback }]) => {
      callback(raf.now())
    })
  return true
})

export function useFrame(callback, priority = 0, deps = []) {
  const id = useId()

  useLayoutEffect(() => {
    if (callback) {
      callbacks[id] = { callback, priority }

      return () => {
        delete callbacks[id]
      }
    }
  }, [callback, id, priority, ...deps])
}

export default useFrame
