import { useCallback, useEffect, useRef } from 'react'
import { useLatestCallback } from '../shared'

type SetStateAction<T> = T | ((prev: T) => T)

/**
 * @name useLazyState
 * @description A React hook that allows you to track state changes via callback without triggering component re-renders.
 * @param {T} initialValue - The initial value of the state.
 * @param {function} callback - The callback function called when the state changes, receiving (newValue, previousValue).
 * @returns {[function, function]} A tuple containing [setState, getState] functions.
 */
export function useLazyState<T>(
  initialValue: T,
  callback?: (value: T, previousValue: T | undefined) => void
): readonly [(value: SetStateAction<T>) => void, () => T] {
  const prevStateRef = useRef<T | undefined>(undefined)
  const stateRef = useRef<T>(initialValue)
  const callbackRef = useLatestCallback(callback)

  useEffect(() => {
    callbackRef.current?.(stateRef.current, prevStateRef.current)
  }, [initialValue, callbackRef])

  const set = useCallback((value: SetStateAction<T>) => {
    const nextValue =
      typeof value === 'function' ? (value as (prev: T) => T)(stateRef.current) : value

    if (nextValue !== stateRef.current) {
      prevStateRef.current = stateRef.current
      callbackRef.current?.(nextValue, stateRef.current)
      stateRef.current = nextValue
    }
  }, [callbackRef])

  const get = useCallback(() => stateRef.current, [])

  return [set, get] as const
}
