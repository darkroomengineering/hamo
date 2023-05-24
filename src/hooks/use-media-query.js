import { useEffect, useState } from 'react'

/**
 * @name useMediaQuery
 * @description A React hook that detects whether a media query is true or false.
 * @param {string} queryString The media query to test against.
 * @returns {boolean} Whether the media query is true or false.
 */

export function useMediaQuery(queryString) {
  const [isMatch, setIsMatch] = useState()

  useEffect(() => {
    const mediaQuery = window.matchMedia(queryString)

    function onChange() {
      setIsMatch(mediaQuery.matches)
    }

    mediaQuery.addEventListener('change', onChange, false)
    onChange()

    return () => mediaQuery.removeEventListener('change', onChange, false)
  }, [queryString])

  return isMatch
}
