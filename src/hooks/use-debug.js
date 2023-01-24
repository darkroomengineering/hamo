/**
 * @summary A hook that returns true if the current window URL contains the
 *   string #debug or if we're in development mode.
 * @returns {Boolean} True if current window URL contains the string #debug or
 *   if we're in development mode, false otherwise.
 */

import { useMemo } from 'react'
import { isClient } from '../misc/util'

function _useDebug() {
  const debug = useMemo(
    () =>
      (window.location.href.includes('#debug') ||
        process.env.NODE_ENV === 'development') &&
      !window.location.href.includes('#production'),
    []
  )
  return debug
}

export const useDebug = isClient ? _useDebug : () => undefined
