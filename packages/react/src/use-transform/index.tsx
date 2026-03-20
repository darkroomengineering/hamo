'use client'

import { useEffectEvent } from '../use-effect-event'
import {
  createContext,
  forwardRef,
  type ReactNode,
  type Ref,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

const DEFAULT_TRANSFORM = {
  translate: { x: 0, y: 0, z: 0 },
  rotate: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  userData: {} as Record<string, unknown>,
}

export type Transform = typeof DEFAULT_TRANSFORM
type TransformCallback = (transform: Transform) => void

export type TransformRef = {
  setTranslate: (x?: number, y?: number, z?: number) => void
  setRotate: (x?: number, y?: number, z?: number) => void
  setScale: (x?: number, y?: number, z?: number) => void
  setUserData: (data: Record<string, unknown>) => void
}

type TransformContextType = {
  getTransform: () => Transform
  addCallback: (callback: TransformCallback) => void
  removeCallback: (callback: TransformCallback) => void
  setTranslate: (x?: number, y?: number, z?: number) => void
  setRotate: (x?: number, y?: number, z?: number) => void
  setScale: (x?: number, y?: number, z?: number) => void
  setUserData: (data: Record<string, unknown>) => void
}

const TransformContext = createContext<TransformContextType>({
  getTransform: () => structuredClone(DEFAULT_TRANSFORM),
  addCallback: () => {},
  removeCallback: () => {},
  setTranslate: () => {},
  setRotate: () => {},
  setScale: () => {},
  setUserData: () => {},
})

type TransformProviderProps = {
  children: ReactNode
}

/**
 * Provider for managing element transforms in a composable hierarchy.
 *
 * Nested providers accumulate transforms — translate and rotate are additive,
 * scale is multiplicative. This lets child components account for parent
 * transforms (e.g., parallax offsets) when computing scroll positions.
 *
 * @example
 * ```tsx
 * import { TransformProvider, useTransform } from 'hamo'
 *
 * function ParallaxWrapper({ children }) {
 *   const ref = useRef<TransformRef>(null)
 *
 *   // Update transform on scroll
 *   useScrollTrigger({
 *     onProgress: ({ progress }) => {
 *       ref.current?.setTranslate(0, progress * -100)
 *     },
 *   })
 *
 *   return (
 *     <TransformProvider ref={ref}>
 *       {children}
 *     </TransformProvider>
 *   )
 * }
 * ```
 */
export const TransformProvider = forwardRef<TransformRef, TransformProviderProps>(function TransformProvider({ children }, ref) {
  const parentTransformRef = useRef(structuredClone(DEFAULT_TRANSFORM))
  const transformRef = useRef(structuredClone(DEFAULT_TRANSFORM))

  function getTransform(): Transform {
    const transform = structuredClone(parentTransformRef.current)

    transform.translate.x += transformRef.current.translate.x
    transform.translate.y += transformRef.current.translate.y
    transform.translate.z += transformRef.current.translate.z

    transform.rotate.x += transformRef.current.rotate.x
    transform.rotate.y += transformRef.current.rotate.y
    transform.rotate.z += transformRef.current.rotate.z

    transform.scale.x *= transformRef.current.scale.x
    transform.scale.y *= transformRef.current.scale.y
    transform.scale.z *= transformRef.current.scale.z

    transform.userData = { ...transform.userData, ...transformRef.current.userData }

    return transform
  }

  const callbacksRef = useRef<TransformCallback[]>([])

  const addCallback = useEffectEvent((callback: TransformCallback) => {
    callbacksRef.current.push(callback)
  })

  const removeCallback = useEffectEvent((callback: TransformCallback) => {
    callbacksRef.current = callbacksRef.current.filter((c) => c !== callback)
  })

  const update = useEffectEvent(() => {
    const transform = getTransform()
    for (const callback of callbacksRef.current) {
      callback(transform)
    }
  })

  function setTranslate(x = 0, y = 0, z = 0) {
    if (!Number.isNaN(x)) transformRef.current.translate.x = Number(x)
    if (!Number.isNaN(y)) transformRef.current.translate.y = Number(y)
    if (!Number.isNaN(z)) transformRef.current.translate.z = Number(z)

    update()
  }

  function setRotate(x = 0, y = 0, z = 0) {
    if (!Number.isNaN(x)) transformRef.current.rotate.x = Number(x)
    if (!Number.isNaN(y)) transformRef.current.rotate.y = Number(y)
    if (!Number.isNaN(z)) transformRef.current.rotate.z = Number(z)
    update()
  }

  function setScale(x = 1, y = 1, z = 1) {
    if (!Number.isNaN(x)) transformRef.current.scale.x = Number(x)
    if (!Number.isNaN(y)) transformRef.current.scale.y = Number(y)
    if (!Number.isNaN(z)) transformRef.current.scale.z = Number(z)
    update()
  }

  function setUserData(data: Record<string, unknown>) {
    Object.assign(transformRef.current.userData, data)
    update()
  }

  // Inherit parent transforms
  useTransform((transform) => {
    parentTransformRef.current = structuredClone(transform)
    update()
  })

  useImperativeHandle(ref, () => ({
    setTranslate,
    setRotate,
    setScale,
    setUserData,
  }))

  return (
    <TransformContext.Provider
      value={{
        getTransform,
        addCallback,
        removeCallback,
        setTranslate,
        setRotate,
        setScale,
        setUserData,
      }}
    >
      {children}
    </TransformContext.Provider>
  )
})

/**
 * Hook to access and react to transform changes from TransformProvider.
 *
 * Without a callback, returns a `getTransform()` function to read the current
 * accumulated transform. With a callback, it fires whenever any ancestor
 * TransformProvider updates its transform.
 *
 * @param callback - Optional callback fired on transform changes
 * @param deps - Dependencies for the callback effect
 * @returns Function to get current accumulated transform
 *
 * @example
 * ```tsx
 * // Read transform on demand
 * const getTransform = useTransform()
 * const { translate } = getTransform()
 *
 * // React to transform changes
 * useTransform((transform) => {
 *   element.style.transform = `translateY(${transform.translate.y}px)`
 * })
 * ```
 */
export function useTransform(
  callback?: TransformCallback,
  deps = [] as unknown[]
) {
  const { getTransform, addCallback, removeCallback } =
    useContext(TransformContext)

  useEffect(() => {
    if (!callback) return

    addCallback(callback)
    return () => {
      removeCallback(callback)
    }
  }, [callback, addCallback, removeCallback, ...deps])

  return getTransform
}
