import { useCallback, useState } from 'react'
import { useLayoutEffect } from './use-isomorphic-layout-effect'

export const useMediaQuery = (queryString) => {
  const [isMatch, setIsMatch] = useState(false)

  const mqChange = useCallback((mq) => {
    setIsMatch(mq.matches)
  }, [])

  useLayoutEffect(() => {
    const mq = window.matchMedia(queryString)
    mqChange(mq)

    try {
      mq?.addEventListener('change', mqChange)
    } catch (e1) {
      try {
        mq?.addListener(mqChange)
      } catch (e2) {
        console.error(e2)
      }
    }

    return () => {
      try {
        mq?.removeEventListener('change', mqChange)
      } catch (e1) {
        try {
          mq?.removeListener(mqChange)
        } catch (e2) {
          console.error(e2)
        }
      }
    }
  })

  return isMatch
}

export default useMediaQuery
