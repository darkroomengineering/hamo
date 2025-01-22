import { useEffect, useCallback, useRef, useState } from 'react'
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
  top?: number
  y?: number
  left?: number
  x?: number
  width?: number
  height?: number
  bottom?: number
  right?: number
  resize?: () => void
  element?: HTMLElement | null
}

let defaultDebounceDelay = 500

function setDebounce(delay: number) {
  defaultDebounceDelay = delay
}

/**
 * @name useRect
 * @description
 * A hook that allows you to get the bounding client rect of an element.
 * @param {object} options - The options for the hook.
 * @param {boolean} options.ignoreTransform - Whether to ignore the transform property of the element.
 * @param {boolean} options.ignoreSticky - Whether to ignore the sticky property of the element.
 * @param {number} options.debounce - The debounce delay (in milliseconds) before the callback function is executed.
 * @param {boolean} options.lazy - Whether to lazy load the rect.
 * @param {function} options.callback - The callback function to be executed after the rect is updated.
 * @param {array} deps - The dependencies array for the hook.
 * @function resize - A function that allows you to manually trigger the rect update.
 * @function setDebounce - A function that allows you to set the debounce delay.
 * @returns {array} [setElementRef, options.lazy ? getRectRef : rect, setWrapperElementRef]
 */

export function useRect<L extends boolean = false>(
  {
    ignoreTransform = false,
    ignoreSticky = true,
    debounce: debounceDelay = defaultDebounceDelay,
    lazy = false as L,
    callback,
  }: {
    ignoreTransform?: boolean
    ignoreSticky?: boolean
    debounce?: number
    lazy?: L
    callback?: (rect: Rect) => void
  } = {},
  deps: any[] = []
): [
  (element: HTMLElement | null) => void,
  L extends true ? () => Rect : Rect,
  (element: HTMLElement | null) => void,
] {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null)
  const [element, setElement] = useState<HTMLElement | null>(null)

  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const updateRect = useCallback(
    ({
      top,
      left,
      width,
      height,
      element,
    }: {
      top?: number
      left?: number
      width?: number
      height?: number
      element?: HTMLElement | null
    }) => {
      top = top ?? rectRef.current.top
      left = left ?? rectRef.current.left
      width = width ?? rectRef.current.width
      height = height ?? rectRef.current.height
      element = element ?? rectRef.current.element

      if (
        top === rectRef.current.top &&
        left === rectRef.current.left &&
        width === rectRef.current.width &&
        height === rectRef.current.height &&
        element === rectRef.current.element
      )
        return

      const y = top
      const x = left
      let bottom: number | undefined
      let right: number | undefined

      if (top !== undefined && height !== undefined) bottom = top + height
      if (left !== undefined && width !== undefined) right = left + width

      rectRef.current = {
        ...rectRef.current,
        top,
        y,
        left,
        x,
        width,
        height,
        bottom,
        right,
        element,
      }

      callbackRef.current?.(rectRef.current)

      if (!lazy) {
        setRect(rectRef.current)
      }
    },
    [lazy, ...deps]
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

    updateRect({
      top,
      left,
    })
  }, [element, ignoreSticky, ignoreTransform, wrapperElement, updateRect])

  const computeDimensions = useCallback(() => {
    if (!element) return

    const rect = element.getBoundingClientRect()

    const width = rect.width
    const height = rect.height

    updateRect({ width, height })
  }, [element, updateRect])

  const resize = useCallback(() => {
    computeCoordinates()
    computeDimensions()
  }, [computeCoordinates, computeDimensions])

  const rectRef = useRef<Rect>({} as Rect)
  const [rect, setRect] = useState<Rect>({} as Rect)

  useEffect(() => {
    rectRef.current.resize = resize
    setRect(rectRef.current)

    return emitter.on('resize', resize)
  }, [resize])

  const [setResizeObserverRef] = useResizeObserver(
    {
      lazy: true,
      debounce: debounceDelay,
      callback: (entry?: ResizeObserverEntry) => {
        if (!entry) return

        const { inlineSize: width, blockSize: height } =
          entry.borderBoxSize[0] ?? {}

        updateRect({
          width,
          height,
        })
      },
    },
    [element, lazy, updateRect]
  )

  const [setWrapperResizeObserverRef] = useResizeObserver(
    {
      lazy: true,
      debounce: debounceDelay,
      callback: computeCoordinates,
    },
    [computeCoordinates]
  )

  useEffect(() => {
    // @ts-ignore
    setWrapperResizeObserverRef((v) => {
      if (v && v !== document.body) return v
      return document.body
    })

    setWrapperElement((v) => {
      if (v && v !== document.body) return v
      return document.body
    })
  }, [setWrapperResizeObserverRef])

  const getRectRef = useCallback(() => rectRef.current, [])

  const setElementRef = useCallback(
    (node: HTMLElement | null) => {
      setResizeObserverRef(node)
      setElement(node)
      updateRect({
        element: node,
      })
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

  return [setElementRef, lazy ? getRectRef : rect, setWrapperElementRef] as [
    typeof setElementRef,
    L extends true ? () => Rect : Rect,
    typeof setWrapperElementRef,
  ]
}

useRect.resize = () => emitter.emit('resize')

useRect.setDebounce = setDebounce
