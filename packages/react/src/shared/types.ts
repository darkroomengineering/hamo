/**
 * Return type for hooks that support lazy mode.
 * When lazy is true, returns a getter function instead of the value directly.
 */
export type LazyReturn<T, L extends boolean> = L extends true
  ? () => T | undefined
  : T | undefined

/**
 * Standard hook return tuple for observer-based hooks with lazy mode support.
 * [setElement, lazyValue | value]
 */
export type ObserverHookReturn<T, L extends boolean> = [
  (element: HTMLElement | null) => void,
  LazyReturn<T, L>,
]

/**
 * Extended hook return tuple with wrapper element setter (used by useRect).
 * [setElement, lazyValue | value, setWrapperElement]
 */
export type ObserverHookReturnWithWrapper<T, L extends boolean> = [
  (element: HTMLElement | null) => void,
  LazyReturn<T, L>,
  (element: HTMLElement | null) => void,
]
