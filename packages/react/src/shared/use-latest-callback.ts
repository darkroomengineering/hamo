import { useRef } from 'react'

/**
 * Stores the latest callback in a ref to avoid stale closures.
 *
 * This pattern is used to:
 * 1. Always have access to the latest callback without adding it to effect dependencies
 * 2. Avoid re-running effects when the callback identity changes
 * 3. Prevent stale closure bugs in event handlers and observers
 *
 * @example
 * ```tsx
 * function useMyHook(callback?: () => void) {
 *   const callbackRef = useLatestCallback(callback)
 *
 *   useEffect(() => {
 *     // Safe to call - always has latest callback
 *     callbackRef.current?.()
 *   }, []) // No need to add callback to deps
 * }
 * ```
 */
export function useLatestCallback<T extends ((...args: never[]) => unknown) | undefined>(
  callback: T
): React.MutableRefObject<T> {
  const ref = useRef<T>(callback)
  ref.current = callback
  return ref
}
