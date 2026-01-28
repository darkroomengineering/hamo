import debounce from 'just-debounce-it'
import { useCallback, useSyncExternalStore } from 'react'
import { createDebounceConfig } from '../shared'

const debounceConfig = createDebounceConfig(500)

type WindowSize = {
  width: number | undefined
  height: number | undefined
  dpr: number | undefined
}

// Cached snapshot to avoid creating new objects on every getSnapshot call
let cachedSnapshot: WindowSize = {
  width: undefined,
  height: undefined,
  dpr: undefined,
}

const serverSnapshot: WindowSize = {
  width: undefined,
  height: undefined,
  dpr: undefined,
}

function getWindowSize(): WindowSize {
  if (typeof window === 'undefined') return serverSnapshot

  const width = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth
  )
  const height = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight
  )
  const dpr = window.devicePixelRatio

  // Only create new object if values changed
  if (
    cachedSnapshot.width !== width ||
    cachedSnapshot.height !== height ||
    cachedSnapshot.dpr !== dpr
  ) {
    cachedSnapshot = { width, height, dpr }
  }

  return cachedSnapshot
}

function getServerSnapshot(): WindowSize {
  return serverSnapshot
}

function createSubscribe(debounceDelay: number) {
  return (callback: () => void) => {
    if (typeof window === 'undefined') {
      return () => {
        /* noop - SSR */
      }
    }

    const debouncedCallback = debounce(callback, debounceDelay)

    window.addEventListener('resize', debouncedCallback)

    return () => {
      window.removeEventListener('resize', debouncedCallback)
      debouncedCallback.cancel()
    }
  }
}

// Cached primitive snapshots for selective hooks
let cachedWidth: number | undefined
let cachedHeight: number | undefined
let cachedDpr: number | undefined

function getWidthSnapshot(): number | undefined {
  if (typeof window === 'undefined') return undefined
  const width = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth
  )
  if (cachedWidth !== width) {
    cachedWidth = width
  }
  return cachedWidth
}

function getHeightSnapshot(): number | undefined {
  if (typeof window === 'undefined') return undefined
  const height = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight
  )
  if (cachedHeight !== height) {
    cachedHeight = height
  }
  return cachedHeight
}

function getDprSnapshot(): number | undefined {
  if (typeof window === 'undefined') return undefined
  const dpr = window.devicePixelRatio
  if (cachedDpr !== dpr) {
    cachedDpr = dpr
  }
  return cachedDpr
}

/**
 * @name useWindowSize
 * @description A React hook that tracks window dimensions using useSyncExternalStore for concurrent-safe subscriptions.
 * @param {number} debounceDelay - The delay (in milliseconds) before the resize event is processed.
 * @returns {{ width: number | undefined, height: number | undefined, dpr: number | undefined }}
 */
export function useWindowSize(
  debounceDelay: number = debounceConfig.getDelay()
): WindowSize {
  const subscribe = useCallback(
    (callback: () => void) => createSubscribe(debounceDelay)(callback),
    [debounceDelay]
  )

  return useSyncExternalStore(subscribe, getWindowSize, getServerSnapshot)
}

/**
 * @name useWindowWidth
 * @description A selective hook that only re-renders when window width changes.
 * @param {number} debounceDelay - The delay (in milliseconds) before the resize event is processed.
 * @returns {number | undefined}
 */
export function useWindowWidth(
  debounceDelay: number = debounceConfig.getDelay()
): number | undefined {
  const subscribe = useCallback(
    (callback: () => void) => createSubscribe(debounceDelay)(callback),
    [debounceDelay]
  )

  return useSyncExternalStore(subscribe, getWidthSnapshot, () => undefined)
}

/**
 * @name useWindowHeight
 * @description A selective hook that only re-renders when window height changes.
 * @param {number} debounceDelay - The delay (in milliseconds) before the resize event is processed.
 * @returns {number | undefined}
 */
export function useWindowHeight(
  debounceDelay: number = debounceConfig.getDelay()
): number | undefined {
  const subscribe = useCallback(
    (callback: () => void) => createSubscribe(debounceDelay)(callback),
    [debounceDelay]
  )

  return useSyncExternalStore(subscribe, getHeightSnapshot, () => undefined)
}

/**
 * @name useWindowDpr
 * @description A selective hook that only re-renders when device pixel ratio changes.
 * @param {number} debounceDelay - The delay (in milliseconds) before the resize event is processed.
 * @returns {number | undefined}
 */
export function useWindowDpr(
  debounceDelay: number = debounceConfig.getDelay()
): number | undefined {
  const subscribe = useCallback(
    (callback: () => void) => createSubscribe(debounceDelay)(callback),
    [debounceDelay]
  )

  return useSyncExternalStore(subscribe, getDprSnapshot, () => undefined)
}

useWindowSize.setDebounce = debounceConfig.setDelay
