'use client'

import {
  type DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

export type DebouncedFunction<T extends (...args: any[]) => void> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      timeoutId = undefined
      fn(...args)
    }, delay)
  }

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  return debounced as DebouncedFunction<T>
}

function timeout(callback: (...args: any[]) => void, delay: number) {
  const timeout = setTimeout(callback, delay)

  return () => clearTimeout(timeout)
}

// A stable-identity callback that always invokes the latest `callback`. Named
// to avoid shadowing React's reserved `useEffectEvent` API — this is a plain
// ref-backed wrapper with none of that hook's call-site restrictions.
function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const [memoizedCallback] = useState(
    () =>
      (...args: Parameters<T>) =>
        callbackRef.current(...args)
  )

  return memoizedCallback as T
}

export function useDebouncedEffect(
  _callback: () => void,
  delay: number,
  deps: DependencyList = []
) {
  const callback = useStableCallback(_callback)

  useEffect(() => {
    return timeout(() => callback(), delay)
  }, [delay, callback, ...deps])
}

export function useDebouncedCallback<T>(
  _callback: (...args: T[]) => void,
  delay: number,
  deps: DependencyList = []
) {
  const callback = useStableCallback(_callback)

  const timeoutRef = useRef<ReturnType<typeof timeout> | null>(null)

  const debouncedCallback = useCallback(
    (...args: T[]) => {
      timeoutRef.current?.()

      timeoutRef.current = timeout(() => callback(...args), delay)
    },
    [delay, callback, ...deps]
  )

  // cancel any pending timer on unmount
  useEffect(() => () => timeoutRef.current?.(), [])

  return debouncedCallback
}

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

// keep the same name for backward compatibility

/**
 * @name useTimeout
 * @description
 * Alias of useDebouncedEffect. Runs the callback once after `delay`, re-arming the
 * timer whenever `delay`, the callback, or any entry in `deps` changes. Kept for
 * backward compatibility.
 * @param {function} callback - The callback function to be executed after the delay.
 * @param {number} delay - The delay (in milliseconds) before the callback function is executed.
 * @param {array} deps - The dependency list that re-arms the timer when changed.
 */
export const useTimeout = useDebouncedEffect
