// This is a custom hook that creates a global event bus. It consists of a dispatch function and a subscribe function.

import { useEffect } from 'react'

let subscribers = []

// The subscribe function is used to subscribe to an event. It returns a function that can be used to unsubscribe from the event. The subscribe function takes a filter and a callback function. The filter can be a string or a function. If the filter is a string, the event will be delivered to the callback if the event type matches the string. If the filter is a function, the event will be delivered to the callback if the function returns true when called with the event.
function subscribe(filter, callbackFn) {
  if (filter === undefined || filter === null) throw new Error('Invalid filter')
  if (callbackFn === undefined || callbackFn === null)
    throw new Error('Invalid callback')

  subscribers = [...subscribers, [filter, callbackFn]]

  return () => {
    subscribers = subscribers.filter(
      (subscriber) => subscriber[1] !== callbackFn
    )
  }
}

// The dispatch function is used to send an event to all subscribers that have subscribed to the event.
export function dispatch(event) {
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

// The custom hook also takes dependencies. The dependencies are used to determine when the subscribe function should be called again. This is useful if you want to subscribe to an event only once. The custom hook returns the dispatch function.
export function useEventBus(type, callback, deps = []) {
  useEffect(() => subscribe(type, callback), [...deps, callback, type])

  return dispatch
}
