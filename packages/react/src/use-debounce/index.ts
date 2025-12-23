import { useCallback, useEffect, useRef, useState } from 'react'

function timeout(callback: (...args: any[]) => void, delay: number) {
  const timeout = setTimeout(callback, delay)

  return () => clearTimeout(timeout)
}

// function debounce(
//   callback: (...args: any[]) => void,
//   delay: number
// ): ((...args: any[]) => void) & { cancel: () => void } {
//   let timeoutInstance: ReturnType<typeof timeout> | null
//   const cancel = () => {
//     console.log('cancel')
//   }
//   Object.assign(debounce, { cancel })

//   return (...args: any[]) => {
//     // cancel()
//     timeoutInstance = timeout(() => callback(...args), delay)
//   }
// }

// function log(...args: any[]) {
//   console.log('log', args)
// }
// const debouncedLog = debounce(log, 1000)
// debouncedLog(1, 2, 3)
// debouncedLog(4, 5, 6)
// debouncedLog(7, 8, 9)
// console.log(debouncedLog.cancel)

export function useDebouncedEffect(
  callback: () => void,
  delay: number,
  deps: any[] = []
) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    return timeout(() => callbackRef.current(), delay)
  }, [delay, ...deps])
}

// export function useDebouncedState<T>(
//   initialValue: T,
//   delay: number
// ): [T, (value: T | ((prev: T) => T)) => void] {
//   const [state, setState] = useState(initialValue)
//   const [debouncedState, setDebouncedState] = useState(initialValue)
//   useDebouncedEffect(() => setDebouncedState(state), delay, [state])
//   return [debouncedState, setState]
// }

export function useDebouncedCallback<T>(
  callback: (...args: T[]) => void,
  delay: number,
  deps: any[] = []
) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const timeoutRef = useRef<ReturnType<typeof timeout> | null>(null)

  const debouncedCallback = useCallback(
    (...args: T[]) => {
      timeoutRef.current?.()

      timeoutRef.current = timeout(() => callbackRef.current(...args), delay)
    },
    [delay, ...deps]
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
