import { useCallback, useEffect, useRef } from 'react'

/**
 * @name useLazyState
 * @description A React hook that allows you to trigger a callback when the state changes without updating the component.
 * @param {any} initialValue The initial value of the state.
 * @param {function} callback The callback function to be called when the state changes.
 * @param {array} deps The dependencies to be used in the callback function.
 * @returns {[function, function]} An array containing the getState function and the setState function.
 */

export function useLazyState<T>(
  initialValue: T,
  callback: (value: T, previousValue: T | undefined) => void,
  deps: any[] = []
) {
  const prevStateRef = useRef<T>()
  const stateRef = useRef<T>(initialValue)
  const callbackRef = useRef(callback)

  callbackRef.current = callback

  useEffect(() => {
    callbackRef.current(stateRef.current, prevStateRef.current)
  }, [initialValue, ...deps])

  function set(value: T | ((prev: T) => T)) {
    if (typeof value === 'function') {
      // @ts-ignore
      const nextValue = value(stateRef.current)
      callbackRef.current(nextValue, stateRef.current)
      stateRef.current = nextValue
      return
    }

    if (value !== stateRef.current) {
      callbackRef.current(value, stateRef.current)
      stateRef.current = value
    }
  }

  const get = useCallback(() => stateRef.current, [])

  return [set, get] as const
}
