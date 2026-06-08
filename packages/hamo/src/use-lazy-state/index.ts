'use client'

import { type DependencyList, useCallback, useEffect, useRef } from 'react'
import { useEffectEvent } from '../use-effect-event'

/**
 * @name useLazyState
 * @description A React hook that allows you to trigger a callback when the state changes without updating the component.
 * @param {any} initialValue The initial value of the state.
 * @param {function} callback The callback function to be called when the state changes.
 * @param {array} deps The dependencies to be used in the callback function.
 * @returns {[function, function]} An array containing the setState function and the getState function.
 */

export function useLazyState<T>(
  initialValue: T,
  callback: (value: T, previousValue: T | undefined) => void,
  deps: DependencyList = []
) {
  const prevStateRef = useRef<T | undefined>(undefined)
  const stateRef = useRef<T>(initialValue)
  const onChange = useEffectEvent(callback)

  // Runs once on mount and again whenever a caller-provided dep changes; reads the
  // latest refs rather than re-subscribing to state.
  useEffect(() => {
    onChange(stateRef.current, prevStateRef.current)
  }, [onChange, ...deps])

  function set(value: T | ((prev: T) => T)) {
    if (typeof value === 'function') {
      const nextValue = (value as (prev: T) => T)(stateRef.current)
      onChange(nextValue, stateRef.current)
      prevStateRef.current = stateRef.current
      stateRef.current = nextValue
      return
    }

    if (value !== stateRef.current) {
      onChange(value, stateRef.current)
      prevStateRef.current = stateRef.current
      stateRef.current = value
    }
  }

  const get = useCallback(() => stateRef.current, [])

  return [set, get] as const
}
