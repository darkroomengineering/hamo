import { useCallback, useMemo, useState } from 'react'
import { useLayoutEffect } from './use-isomorphic-layout-effect'

export const useMediaQuery = (queryString) => {
  const mediaQuery = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia(queryString),
    [queryString]
  )
  const [isMatch, setIsMatch] = useState(mediaQuery.matches)

  const onChange = useCallback(({ matches }) => {
    setIsMatch(matches)
  }, [])

  useLayoutEffect(() => {
    onChange(mediaQuery)

    mediaQuery.addEventListener('change', onChange, { passive: true })

    return () => {
      mediaQuery.removeEventListener('change', onChange, { passive: true })
    }
  }, [mediaQuery, onChange])

  return isMatch
}

export default useMediaQuery
