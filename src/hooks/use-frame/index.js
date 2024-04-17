/**
 * Creates a requestAnimationFrame loop and manages the lifecycle of the callback.
 * @param {Function} callback - A function that is called every frame.
 * @param {Number} priority - A number that determines the order in which the callback is called.
 */

import Tempus from '@darkroom.engineering/tempus'
import { useEffect } from 'react'

export function useFrame(callback, priority = 0) {
  useEffect(() => {
    if (callback) {
      Tempus.add(callback, priority)

      return () => Tempus.remove(callback)
    }
  }, [callback, priority])
}
