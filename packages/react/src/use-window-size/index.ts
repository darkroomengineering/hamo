import { useCallback, useSyncExternalStore } from 'react'
import debounce from 'just-debounce-it'
import { createDebounceConfig } from '../shared'

const debounceConfig = createDebounceConfig(500)

type WindowSize = {
  width: number | undefined
  height: number | undefined
  dpr: number | undefined
}

const getWindowSize = (): WindowSize => ({
  width: Math.min(window.innerWidth, document.documentElement.clientWidth),
  height: Math.min(window.innerHeight, document.documentElement.clientHeight),
  dpr: window.devicePixelRatio,
})

const serverSnapshot: WindowSize = {
  width: undefined,
  height: undefined,
  dpr: undefined,
}

function createSubscribe(debounceDelay: number) {
  return (callback: () => void) => {
    const debouncedCallback = debounce(callback, debounceDelay)

    window.addEventListener('resize', debouncedCallback)

    return () => {
      window.removeEventListener('resize', debouncedCallback)
      debouncedCallback.cancel()
    }
  }
}

/**
 * @name useWindowSize
 * @description A React hook that tracks window dimensions using useSyncExternalStore for concurrent-safe subscriptions.
 * @param {number} debounceDelay - The delay (in milliseconds) before the resize event is processed.
 * @returns {{ width: number | undefined, height: number | undefined, dpr: number | undefined }}
 */
export function useWindowSize(debounceDelay: number = debounceConfig.getDelay()): WindowSize {
  const subscribe = useCallback(
    (callback: () => void) => createSubscribe(debounceDelay)(callback),
    [debounceDelay]
  )

  return useSyncExternalStore(subscribe, getWindowSize, () => serverSnapshot)
}

/**
 * @name useWindowWidth
 * @description A selective hook that only re-renders when window width changes.
 * @param {number} debounceDelay - The delay (in milliseconds) before the resize event is processed.
 * @returns {number | undefined}
 */
export function useWindowWidth(debounceDelay: number = debounceConfig.getDelay()): number | undefined {
  const subscribe = useCallback(
    (callback: () => void) => createSubscribe(debounceDelay)(callback),
    [debounceDelay]
  )

  return useSyncExternalStore(
    subscribe,
    () => Math.min(window.innerWidth, document.documentElement.clientWidth),
    () => undefined
  )
}

/**
 * @name useWindowHeight
 * @description A selective hook that only re-renders when window height changes.
 * @param {number} debounceDelay - The delay (in milliseconds) before the resize event is processed.
 * @returns {number | undefined}
 */
export function useWindowHeight(debounceDelay: number = debounceConfig.getDelay()): number | undefined {
  const subscribe = useCallback(
    (callback: () => void) => createSubscribe(debounceDelay)(callback),
    [debounceDelay]
  )

  return useSyncExternalStore(
    subscribe,
    () => Math.min(window.innerHeight, document.documentElement.clientHeight),
    () => undefined
  )
}

/**
 * @name useWindowDpr
 * @description A selective hook that only re-renders when device pixel ratio changes.
 * @param {number} debounceDelay - The delay (in milliseconds) before the resize event is processed.
 * @returns {number | undefined}
 */
export function useWindowDpr(debounceDelay: number = debounceConfig.getDelay()): number | undefined {
  const subscribe = useCallback(
    (callback: () => void) => createSubscribe(debounceDelay)(callback),
    [debounceDelay]
  )

  return useSyncExternalStore(
    subscribe,
    () => window.devicePixelRatio,
    () => undefined
  )
}

useWindowSize.setDebounce = debounceConfig.setDelay
