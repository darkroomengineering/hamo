// This code exports the functions isClient, noop, on, and off

// isClient is a variable that is a boolean, it checks if window is defined
export const isClient = typeof window !== 'undefined'

// noop is an empty function
export function noop() {}

// on is a function that takes an object as the first argument and calls the addEventListener method on it
export function on(obj, ...args) {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...args)
  } else {
    throw new Error('addEventListener is not supported')
  }
}

// off is a function that takes an object as the first argument and calls the removeEventListener method on it
export function off(obj, ...args) {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...args)
  } else {
    throw new Error('removeEventListener is not supported')
  }
}
