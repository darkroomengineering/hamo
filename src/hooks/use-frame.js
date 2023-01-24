/**
 * Creates a requestAnimationFrame loop and manages the lifecycle of the callback.
 * @param {Function} callback - A function that is called every frame.
 * @param {Number} priority - A number that determines the order in which the callback is called.
 * @returns {Number} The ID of the callback.
 */
import { raf } from '@studio-freight/tempus'
import { useLayoutEffect } from './use-isomorphic-layout-effect'

export function useFrame(callback, priority = 0) {
  useLayoutEffect(() => {
    if (callback) {
      const id = raf.add(callback, priority)
      return () => {
        raf.remove(id)
      }
    }
  }, [callback, priority])
}
