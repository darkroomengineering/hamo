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

  const setRef = (node) => {
    if (!ref.current) {
      ref.current = node
    }
  }

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
      observer.current.disconnect()
    }
  }, [callbackFunction])

  useEffect(() => {
    if (once && inView) {
      observer.current.disconnect()
    }
  }, [inView])

  return { setRef, inView }
}

export default useIsVisible
