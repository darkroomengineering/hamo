import { useCallback, useSyncExternalStore } from 'react'

/**
 * @name useMediaQuery
 * @description A React hook that detects whether a media query matches using useSyncExternalStore for concurrent-safe subscriptions.
 * @param {string} query - The media query to test against.
 * @param {boolean} serverFallback - Optional fallback value for SSR (defaults to false).
 * @returns {boolean} Whether the media query matches.
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', callback)
      return () => mediaQuery.removeEventListener('change', callback)
    },
    [query]
  )

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches
  }, [query])

  const getServerSnapshot = useCallback(() => serverFallback, [serverFallback])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
