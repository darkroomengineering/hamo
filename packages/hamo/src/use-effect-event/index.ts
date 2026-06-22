import { useCallback, useInsertionEffect, useRef } from 'react'

/**
 * Ponyfill for React's experimental `useEffectEvent`.
 *
 * Returns a stable function identity that always calls the latest `callback`,
 * so the returned event can be omitted from effect dependency arrays without
 * going stale. The ref is refreshed in `useInsertionEffect` (before any layout
 * effect reads it), matching React's own internal implementation and avoiding
 * render-phase ref mutation.
 */
export function useEffectEvent<T extends (...args: never[]) => unknown>(
  callback: T
): T {
  const callbackRef = useRef(callback)

  useInsertionEffect(() => {
    callbackRef.current = callback
  })

  const stableCallback = useCallback(
    (...args: Parameters<T>) => callbackRef.current(...args),
    []
  )

  return stableCallback as unknown as T
}
