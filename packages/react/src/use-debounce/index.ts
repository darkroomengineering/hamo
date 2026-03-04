import { useCallback, useEffect, useRef, useState } from 'react'
import { useLatestCallback } from '../shared'

function timeout(callback: () => void, delay: number): () => void {
  const timeoutId = setTimeout(callback, delay)
  return () => clearTimeout(timeoutId)
}

/**
 * @name useDebouncedEffect
 * @description A hook that runs an effect after a specified delay, resetting on dependency changes.
 * @param {function} callback - The callback function to be executed after the delay.
 * @param {number} delay - The delay (in milliseconds) before the callback is executed.
 * @param {array} deps - The dependencies array that triggers the effect when changed.
 */
export function useDebouncedEffect(
  callback: () => void,
  delay: number,
  deps: React.DependencyList = []
): void {
  const callbackRef = useLatestCallback(callback)

  useEffect(() => {
    return timeout(() => callbackRef.current?.(), delay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, callbackRef, ...deps])
}

/**
 * @name useDebouncedCallback
 * @description A hook that returns a debounced version of the provided callback.
 * @param {function} callback - The callback function to debounce.
 * @param {number} delay - The delay (in milliseconds) before the callback is executed.
 * @returns {function} The debounced callback function.
 */
export function useDebouncedCallback<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number
): (...args: T) => void {
  const callbackRef = useLatestCallback(callback)

  const timeoutRef = useRef<(() => void) | null>(null)

  const debouncedCallback = useCallback(
    (...args: T) => {
      timeoutRef.current?.()
      timeoutRef.current = timeout(() => callbackRef.current?.(...args), delay)
    },
    [delay, callbackRef]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => timeoutRef.current?.()
  }, [])

  return debouncedCallback
}

/**
 * @name useDebouncedState
 * @description A hook that provides state with debounced updates.
 * @param {T} initialValue - The initial state value.
 * @param {number} delay - The delay (in milliseconds) before state updates are applied.
 * @returns {[T, function]} A tuple containing the debounced state and a setter function.
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number
): [T, (value: T | ((prev: T) => T)) => void] {
  const [debouncedState, setDebouncedState] = useState(initialValue)
  const cachedStateRef = useRef(initialValue)

  const updateDebouncedState = useDebouncedCallback(
    () => setDebouncedState(cachedStateRef.current),
    delay
  )

  const setState = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (typeof value === 'function') {
        cachedStateRef.current = (value as (prev: T) => T)(
          cachedStateRef.current
        )
      } else {
        cachedStateRef.current = value
      }
      updateDebouncedState()
    },
    [updateDebouncedState]
  )

  return [debouncedState, setState]
}

/**
 * @name useTimeout
 * @description Alias for useDebouncedEffect. Runs a callback after a specified delay.
 * @param {function} callback - The callback function to be executed after the delay.
 * @param {number} delay - The delay (in milliseconds) before the callback is executed.
 * @param {array} deps - The dependencies array that triggers the effect when changed.
 */
export const useTimeout = useDebouncedEffect
