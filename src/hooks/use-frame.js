/**
 * Creates a requestAnimationFrame loop and manages the lifecycle of the callback.
 * @param {Function} callback - A function that is called every frame.
 * @param {Number} priority - A number that determines the order in which the callback is called.
 */
import { raf } from '@studio-freight/tempus'
import { useEffect } from 'react'

export function useFrame(callback, priority = 0) {
  useEffect(() => {
    if (callback) {
      raf.add(callback, priority)

      return () => raf.remove(callback)
    }
  }, [callback, priority])
}
