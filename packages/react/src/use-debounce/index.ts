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

function useEffectEvent<T extends (...args: any[]) => any>(callback: T): T {
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
  const callback = useEffectEvent(_callback)

  useEffect(() => {
    return timeout(() => callback(), delay)
  }, [delay, callback, ...deps])
}

export function useDebouncedCallback<T>(
  _callback: (...args: T[]) => void,
  delay: number,
  deps: DependencyList = []
) {
  const callback = useEffectEvent(_callback)

  const timeoutRef = useRef<ReturnType<typeof timeout> | null>(null)

  const debouncedCallback = useCallback(
    (...args: T[]) => {
      timeoutRef.current?.()

      timeoutRef.current = timeout(() => callback(...args), delay)
    },
    [delay, callback, ...deps]
  )

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
 * A hook that allows you to set a timeout.
 * @param {function} callback - The callback function to be executed after the delay.
 * @param {number} delay - The delay (in milliseconds) before the callback function is executed.
 * @param {array} deps - The dependencies array for the hook.
 */
export const useTimeout = useDebouncedEffect
