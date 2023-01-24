/**
 * A React hook that uses the useLayoutEffect hook in environments that support it,
 * and falls back to useEffect in environments that don't support useLayoutEffect.
 *
 * @param {function} effect The effect function to call
 * @param {array} deps An array of dependencies to use for the effect
 */

import { useEffect, useLayoutEffect as vanillaUseLayoutEffect } from 'react'
import { isClient } from '../misc/util'

export const useLayoutEffect = isClient ? vanillaUseLayoutEffect : useEffect
