import { useRef } from 'react'
import { useEffectOnce } from './use-effect-once'

export const useUnmount = (fn) => {
  const fnRef = useRef(fn)

  // update the ref each render so if it change the newest callback will be invoked
  fnRef.current = fn

  useEffectOnce(() => () => fnRef.current())
}
