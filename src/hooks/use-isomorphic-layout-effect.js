import { useEffect, useLayoutEffect } from 'react'
import { isBrowser } from '../misc/util'

export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect
