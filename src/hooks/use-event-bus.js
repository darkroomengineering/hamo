import { useEffect } from 'react'

let subscribers = []

const subscribe = (filter, callbackFn) => {
  if (filter === undefined || filter === null) return undefined
  if (callbackFn === undefined || callbackFn === null) return undefined

  subscribers = [...subscribers, [filter, callbackFn]]

  return () => {
    subscribers = subscribers.filter(
      (subscriber) => subscriber[1] !== callbackFn
    )
  }
}

export const dispatch = (event) => {
  let { type } = event
  if (typeof event === 'string') type = event

  const args = []
  if (typeof event === 'string') args.push({ type })
  else args.push(event)

  subscribers.forEach(([filter, callbackFn]) => {
    if (typeof filter === 'string' && filter !== type) return
    if (typeof filter === 'function' && !filter(...args)) return
    callbackFn(...args)
  })
}

export const useEventBus = (type, callback, deps = []) => {
  /* eslint-disable */
  useEffect(() => subscribe(type, callback), [...deps, callback, type])
  /* eslint-enable */

  return dispatch
}

export default useEventBus
