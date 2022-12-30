import { useCallback, useMemo, useState } from 'react'
import { isClient } from '../utils'

const useMediaQuery = (queryString) => {
  const mediaQuery = useMemo(
    () => window.matchMedia(queryString),
    [queryString]
  )
  const [isMatch, setIsMatch] = useState(mediaQuery.matches)

  const onChange = useCallback(({ matches }) => {
    setIsMatch(matches)
  }, [])

  useEffect(() => {
    onChange(mediaQuery)

    mediaQuery.addEventListener('change', onChange, { passive: true })

    return () => {
      mediaQuery.removeEventListener('change', onChange, { passive: true })
    }
  }, [mediaQuery, onChange])

  return isMatch
}

export default isClient ? useMediaQuery : () => undefined
