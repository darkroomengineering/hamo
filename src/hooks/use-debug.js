import { useEffect, useState } from 'react'
import { isBrowser } from '../misc/util'

export const useDebug = () => {
  const [debug, setDebug] = useState(false)

  useEffect(() => {
    setDebug(
      window.pathname.current.includes('#debug') ||
        process.env.NODE_ENV === 'development'
    )
  }, [])

  return isBrowser ? debug : false
}
