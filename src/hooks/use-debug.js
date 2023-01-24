import { useMemo } from 'react'
import { isClient } from '../utils'

export const useDebug = () => {
  const debug = useMemo(
    () =>
      (window.location.href.includes('#debug') ||
        process.env.NODE_ENV === 'development') &&
      !window.location.href.includes('#production'),
    []
  )
  return debug
}

export default isClient ? useDebug : () => undefined
