// This component is used to check if the window object is present.
// It is used in a useMemo hook to memoize the value of whether the window object is present.
// This is used to prevent errors from occurring during SSR (server-side rendering).
// The window object is not present during SSR, so we need to check for its presence before using it.

import { useMemo } from 'react'

export function useIsClient() {
  const isClient = useMemo(() => typeof window !== 'undefined', [])
  return isClient
}
