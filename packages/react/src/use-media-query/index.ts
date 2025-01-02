import { useEffect, useState } from 'react'

/**
 * @name useMediaQuery
 * @description A React hook that detects whether a media query is true or false.
 * @param {string} query The media query to test against.
 * @returns {boolean} Whether the media query is true or false.
 */

export function useMediaQuery(query: string) {
  const [isMatch, setIsMatch] = useState<boolean>()

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    function onChange() {
      setIsMatch(mediaQuery.matches)
    }

    mediaQuery.addEventListener('change', onChange, false)
    onChange()

    return () => mediaQuery.removeEventListener('change', onChange, false)
  }, [query])

  return isMatch
}
