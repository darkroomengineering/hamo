import { nanoid } from 'nanoid'
import { useMemo } from 'react'

export function useId() {
  const id = useMemo(() => nanoid(), [])

  return id
}

export default useId