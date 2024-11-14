/**
 * Creates a requestAnimationFrame loop and manages the lifecycle of the callback.
 * @param {Function} callback - A function that is called every frame.
 * @param {Number} priority - A number that determines the order in which the callback is called.
 */

import Tempus from '@darkroom.engineering/tempus'
import { useEffect, useRef } from 'react'

export function useFrame(callback, priority = 0) {
  useEffect(() => {
    if (callback) {
      Tempus.add(callback, priority)

      return () => Tempus.remove(callback)
    }
  }, [callback, priority])
}

export function useFramerate(fps, callback, priority = 0) {
  const timeRef = useRef(0)
  const lastTickDateRef = useRef()

  const executionTime = 1000 / fps

  useFrame((time, delaTime) => {
    timeRef.current += delaTime

    if (!lastTickDateRef.current) lastTickDateRef.current = time

    if (timeRef.current >= executionTime) {
      timeRef.current = timeRef.current % executionTime
      const delaTime = time - lastTickDateRef.current
      lastTickDateRef.current = time

      callback?.(time, delaTime)
    }
  }, priority)
}
