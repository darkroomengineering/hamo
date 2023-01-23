/**
 * @summary A hook that returns true if the current window URL contains the
 *   string #debug or if we're in development mode.
 * @returns {Boolean} True if current window URL contains the string #debug or
 *   if we're in development mode, false otherwise.
 */

import { useMemo } from 'react'

export const useDebug = () => {
  const debug = useMemo(
    () =>
      typeof window !== 'undefined'
        ? window.location.href.includes('#debug') ||
          process.env.NODE_ENV === 'development'
        : false,
    []
  )
  return debug
}

export default useDebug
