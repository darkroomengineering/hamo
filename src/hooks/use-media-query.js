import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIsClient } from './use-is-client'

/**
 * @name useMediaQuery
 * @description A React hook that detects whether a media query is true or false.
 * @param {string} queryString - The media query to test against.
 * @returns {boolean} - Whether the media query is true or false.
 */

export function useMediaQuery(queryString) {
  const isClient = useIsClient()

  const mediaQuery = useMemo(() => {
    if (isClient) {
      try {
        return window.matchMedia(queryString)
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(error)
        }
      }
    }

    return null
  }, [queryString, isClient])

  const [isMatch, setIsMatch] = useState(undefined)

  const onChange = useCallback(({ matches }) => {
    setIsMatch(matches)
  }, [])

  useEffect(() => {
    if (mediaQuery) {
      onChange(mediaQuery)

      mediaQuery.addEventListener('change', onChange, { passive: true })

      return () => {
        mediaQuery.removeEventListener('change', onChange, { passive: true })
      }
    }
  }, [mediaQuery, onChange, isClient])

  return isMatch
}
