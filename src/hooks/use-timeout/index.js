import { useEffect } from 'react'

export function useTimeout(callback, delay, deps = []) {
  useEffect(() => {
    const timeout = setTimeout(callback, delay)

    return () => {
      clearTimeout(timeout)
    }
  }, [delay, ...deps])
}
