import { raf } from '@react-spring/rafz'
import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

// https://github.com/pmndrs/react-spring/tree/master/packages/rafz#readme

const callbacks = {}

/* eslint-disable */
raf.onFrame(() => {
  Object.entries(callbacks)
    .sort((a, b) => a[1].priority - b[1].priority)
    .forEach(([_, { callback }]) => {
      callback(raf.now())
    })
  return true
})
/* eslint-enable */

export function useFrame(callback, priority = 0, deps = []) {
  const id = useMemo(() => uuidv4(), [])

  useIsomorphicLayoutEffect(() => {
    if (callback) {
      callbacks[id] = { callback, priority }

      return () => {
        delete callbacks[id]
      }
    }
  }, [callback, id, priority, ...deps])
}
