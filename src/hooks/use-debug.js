/**
 * @summary A hook that returns true if the current window URL contains the
 *   string #debug or if we're in development mode.
 * @returns {Boolean} True if current window URL contains the string #debug or
 *   if we're in development mode, false otherwise.
 */

import { useMemo } from 'react'
import { useIsClient } from './use-is-client'

export function useDebug() {
  const isClient = useIsClient()
  const debug = useMemo(
    () =>
      isClient &&
      (window.location.href.includes('#debug') || process.env.NODE_ENV === 'development') &&
      !window.location.href.includes('#production'),
    [isClient]
  )

  return debug
}
