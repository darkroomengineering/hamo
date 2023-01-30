/**
 * A React hook that uses the useLayoutEffect hook in environments that support it,
 * and falls back to useEffect in environments that don't support useLayoutEffect.
 *
 * @param {function} effect The effect function to call
 * @param {array} deps An array of dependencies to use for the effect
 */

import { useEffect, useLayoutEffect as vanillaUseLayoutEffect } from 'react'
import { useIsClient } from './use-is-client'

export function useLayoutEffect(effect, deps) {
  const isClient = useIsClient()

  if (isClient) {
    vanillaUseLayoutEffect(effect, deps)
  } else {
    useEffect(effect, deps)
  }
}
