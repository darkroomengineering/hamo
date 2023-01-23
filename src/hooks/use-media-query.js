/**
 * @name useMediaQuery
 * @description A React hook that detects whether a media query is true or false.
 * @param {string} queryString - The media query to test against.
 * @returns {boolean} - Whether the media query is true or false.
 */
<<<<<<< HEAD

import { useCallback, useEffect, useMemo, useState } from 'react'
import { isClient } from '../misc/util'

export function useMediaQuery(queryString) {
  const mediaQuery = useMemo(() => {
    if (isClient) {
=======

import { useCallback, useEffect, useMemo, useState } from 'react'
import { isBrowser } from '../misc/util'

const useMediaQuery = (queryString) => {
  const mediaQuery = useMemo(() => {
    if (isBrowser) {
>>>>>>> 77f4ee0 (updates)
      try {
        return window.matchMedia(queryString)
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(error)
        }
      }
    }

    return null
  }, [queryString])

  const [isMatch, setIsMatch] = useState(
    mediaQuery ? mediaQuery.matches : false
  )

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
  }, [mediaQuery, onChange])

  return isMatch
}
<<<<<<< HEAD
=======

export default useMediaQuery
>>>>>>> 77f4ee0 (updates)
