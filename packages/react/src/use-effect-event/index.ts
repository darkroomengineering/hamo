import { useRef, useState } from 'react'

export function useEffectEvent<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const [memoizedCallback] = useState(
    () =>
      (...args: Parameters<T>) =>
        callbackRef.current(...args)
  )

  return memoizedCallback as T
}
