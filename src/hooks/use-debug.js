import { useMemo } from 'react'

export const useDebug = () => {
  const debug = useMemo(() => {
    return (
      window.location.pathname.includes('#debug') ||
      process.env.NODE_ENV === 'development'
    )
  }, [window.location.pathname])

  return debug
}
