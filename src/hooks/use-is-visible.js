// useIsVisible is a custom hook that allows you to detect when an element is
// visible on the screen. It takes an object as an argument, and returns an object
// with two properties: setRef and inView.

import { useCallback, useEffect, useRef, useState } from 'react'

export const useIsVisible = ({
  root = null,
  rootMargin = '0px',
  threshold = 1.0,
  once = false,
} = {}) => {
  const observer = useRef()
  const ref = useRef()
  const [inView, setInView] = useState(false)

  const setRef = useCallback((node) => {
    if (!ref.current) {
      ref.current = node
    }
  }, [])

  const callbackFunction = useCallback((entries) => {
    const [entry] = entries
    setInView(entry.isIntersecting)
  }, [])

  useEffect(() => {
    observer.current = new IntersectionObserver(callbackFunction, {
      root,
      rootMargin,
      threshold,
    })
    if (ref.current) observer.current.observe(ref.current)
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [callbackFunction])

  useEffect(() => {
    if (once && inView) {
      observer.current.disconnect()
    }
  }, [inView])

  return { setRef, inView }
}
