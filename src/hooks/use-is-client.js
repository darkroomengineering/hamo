// This component is used to check if the window object is present.
import { useEffect, useState } from 'react'

export function useIsClient() {
  const [isClient, setClient] = useState(false)

  useEffect(() => {
    setClient(true)
  }, [])

  return isClient
}
