import { useEffect, useState } from 'react'

export const useDebug = () => {
  const [debug, setDebug] = useState()

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash)
    setDebug(params.get('debug') || process.env.NODE_ENV === 'development')
  }, [])

  return debug
}

export default useDebug
