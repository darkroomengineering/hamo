import { useMemo } from 'react'
import { useIsClient } from './use-is-client'

export function useDebug() {
  const isClient = useIsClient()

  const debug = useMemo(() => {
    if (!isClient) return undefined

    const location = window.location
    const search = location.search
    const href = location.href
    const searchParams = new URLSearchParams(search)

    const isDebug =
      href.includes('#debug') || // localhost:3000/#debug
      href.includes('/_debug') || // localhost:3000/_debug
      searchParams.has('debug') || // localhost:3000/?debug
      // eslint-disable-next-line no-undef
      process.env.NODE_ENV === 'development' // localhost:3000

    const isProduction =
      href.includes('#production') || // localhost:3000/#production
      searchParams.has('production') // localhost:3000/?production

    return isDebug && !isProduction
  }, [isClient])

  return debug
}
