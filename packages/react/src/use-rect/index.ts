import { useEffect, useCallback, useRef, useState, useSyncExternalStore } from 'react'
import {
  addParentSticky,
  offsetLeft,
  offsetTop,
  removeParentSticky,
  scrollLeft,
  scrollTop,
} from './utils'
import { emitter } from './emitter'
import { useResizeObserver } from '../use-resize-observer'

export type Rect = {
  top: number | undefined
  y: number | undefined
  left: number | undefined
  x: number | undefined
  width: number | undefined
  height: number | undefined
  bottom: number | undefined
  right: number | undefined
  resize: () => void
  element: HTMLElement | null | undefined
}

let defaultDebounceDelay = 500

function setDebounce(delay: number) {
  defaultDebounceDelay = delay
}

// Subscribe to global resize events using useSyncExternalStore pattern
function subscribeToResize(callback: () => void): () => void {
  return emitter.on('resize', callback)
}

function getResizeSnapshot(): number {
  // Return a stable value - the snapshot is used to detect changes
  // We use Date.now() as a change indicator since the emitter doesn't have a value
  return Date.now()
}

type UseRectOptions<L extends boolean = false> = {
  ignoreTransform?: boolean
  ignoreSticky?: boolean
  debounce?: number
  lazy?: L
  callback?: (rect: Rect) => void
}

type UseRectReturn<L extends boolean> = [
  (element: HTMLElement | null) => void,
  L extends true ? () => Rect : Rect,
  (element: HTMLElement | null) => void,
]

/**
 * @name useRect
 * @description A hook that tracks an element's position and dimensions within the page.
 * @param {object} options - The options for the hook.
 * @param {boolean} options.ignoreTransform - Whether to ignore CSS transforms when calculating position.
 * @param {boolean} options.ignoreSticky - Whether to ignore sticky positioning when calculating position.
 * @param {number} options.debounce - The debounce delay (in milliseconds) before updates are processed.
 * @param {boolean} options.lazy - If true, returns a getter function instead of triggering re-renders.
 * @param {function} options.callback - The callback function called when the rect is updated.
 * @returns {array} [setElementRef, lazy ? getRectRef : rect, setWrapperElementRef]
 */
export function useRect<L extends boolean = false>(
  options: UseRectOptions<L> = {}
): UseRectReturn<L> {
  const {
    ignoreTransform = false,
    ignoreSticky = true,
    debounce: debounceDelay = defaultDebounceDelay,
    lazy = false as L,
    callback,
  } = options

  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null)
  const [element, setElement] = useState<HTMLElement | null>(null)

  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const rectRef = useRef<Rect>({
    top: undefined,
    y: undefined,
    left: undefined,
    x: undefined,
    width: undefined,
    height: undefined,
    bottom: undefined,
    right: undefined,
    resize: () => {},
    element: undefined,
  })
  const [rect, setRect] = useState<Rect>(rectRef.current)

  const updateRect = useCallback(
    (updates: Partial<Omit<Rect, 'resize'>>) => {
      const current = rectRef.current
      const top = updates.top ?? current.top
      const left = updates.left ?? current.left
      const width = updates.width ?? current.width
      const height = updates.height ?? current.height
      const newElement = updates.element ?? current.element

      // Skip update if nothing changed
      if (
        top === current.top &&
        left === current.left &&
        width === current.width &&
        height === current.height &&
        newElement === current.element
      ) {
        return
      }

      const y = top
      const x = left
      const bottom = top !== undefined && height !== undefined ? top + height : undefined
      const right = left !== undefined && width !== undefined ? left + width : undefined

      rectRef.current = {
        ...current,
        top,
        y,
        left,
        x,
        width,
        height,
        bottom,
        right,
        element: newElement,
      }

      callbackRef.current?.(rectRef.current)

      if (!lazy) {
        setRect(rectRef.current)
      }
    },
    [lazy]
  )

  const computeCoordinates = useCallback(() => {
    if (!element || !wrapperElement) return

    let top: number
    let left: number

    if (ignoreSticky) removeParentSticky(element)

    if (ignoreTransform) {
      top = offsetTop(element)
      left = offsetLeft(element)
    } else {
      const rect = element.getBoundingClientRect()
      top = rect.top + scrollTop(wrapperElement)
      left = rect.left + scrollLeft(wrapperElement)
    }

    if (ignoreSticky) addParentSticky(element)

    updateRect({ top, left })
  }, [element, ignoreSticky, ignoreTransform, wrapperElement, updateRect])

  const computeDimensions = useCallback(() => {
    if (!element) return

    const rect = element.getBoundingClientRect()
    updateRect({ width: rect.width, height: rect.height })
  }, [element, updateRect])

  const resize = useCallback(() => {
    computeCoordinates()
    computeDimensions()
  }, [computeCoordinates, computeDimensions])

  // Subscribe to global resize events
  useSyncExternalStore(
    subscribeToResize,
    getResizeSnapshot,
    () => 0 // Server snapshot
  )

  // Update resize function reference and subscribe to emitter
  useEffect(() => {
    rectRef.current.resize = resize
    setRect(rectRef.current)

    return emitter.on('resize', resize)
  }, [resize])

  // Observe element size changes
  const [setResizeObserverRef] = useResizeObserver({
    lazy: true,
    debounce: debounceDelay,
    callback: (entry) => {
      if (!entry) return

      const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0] ?? {}
      updateRect({ width, height })
    },
  })

  // Observe wrapper size changes
  const [setWrapperResizeObserverRef] = useResizeObserver({
    lazy: true,
    debounce: debounceDelay,
    callback: computeCoordinates,
  })

  // Initialize wrapper to document.body if not set
  useEffect(() => {
    // SSR safety check
    if (typeof window === 'undefined') return

    setWrapperResizeObserverRef(document.body)
    setWrapperElement(document.body)
  }, [setWrapperResizeObserverRef])

  const getRectRef = useCallback(() => rectRef.current, [])

  const setElementRef = useCallback(
    (node: HTMLElement | null) => {
      setResizeObserverRef(node)
      setElement(node)
      updateRect({ element: node })
    },
    [setResizeObserverRef, updateRect]
  )

  const setWrapperElementRef = useCallback(
    (node: HTMLElement | null) => {
      setWrapperResizeObserverRef(node)
      setWrapperElement(node)
    },
    [setWrapperResizeObserverRef]
  )

  return [setElementRef, lazy ? getRectRef : rect, setWrapperElementRef] as UseRectReturn<L>
}

useRect.resize = () => emitter.emit('resize')
useRect.setDebounce = setDebounce
