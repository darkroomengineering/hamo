/**
 * useOutsideClickEvent - custom hook that listens for clicks outside of a component
 * @param {Object} ref - React ref for the element to listen for clicks outside of
 * @param {Function} callback - callback function to call when a click outside of the element is detected
 */

import { useCallback, useEffect } from 'react'

export function useOutsideClickEvent(ref, callback) {
  const handleClickOutside = useCallback(
    (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    },
    [ref, callback]
  )

  useEffect(() => {
    if (ref.current) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [handleClickOutside, ref])
}
