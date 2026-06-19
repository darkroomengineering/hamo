'use client'

import {
  createContext,
  type DependencyList,
  forwardRef,
  type ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { useEffectEvent } from '../use-effect-event'

export type Transform = {
  translate: { x: number; y: number; z: number }
  rotate: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  userData: Record<string, unknown>
}

function createTransform(): Transform {
  return {
    translate: { x: 0, y: 0, z: 0 },
    rotate: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    userData: {},
  }
}

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

export const TransformContext = createContext<TransformContextType>({
  getTransform: () => createTransform(),
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
export const TransformProvider = forwardRef<
  TransformRef,
  TransformProviderProps
>(function TransformProvider({ children }, ref) {
  const parentTransformRef = useRef(createTransform())
  const transformRef = useRef(createTransform())

  function getTransform(): Transform {
    const parent = parentTransformRef.current
    const self = transformRef.current

    // Accumulate parent + self into a fresh object on every call (no clone):
    // translate/rotate are additive, scale is multiplicative, userData merges.
    return {
      translate: {
        x: parent.translate.x + self.translate.x,
        y: parent.translate.y + self.translate.y,
        z: parent.translate.z + self.translate.z,
      },
      rotate: {
        x: parent.rotate.x + self.rotate.x,
        y: parent.rotate.y + self.rotate.y,
        z: parent.rotate.z + self.rotate.z,
      },
      scale: {
        x: parent.scale.x * self.scale.x,
        y: parent.scale.y * self.scale.y,
        z: parent.scale.z * self.scale.z,
      },
      // Deep-clone the parent's userData (so a callback mutating a nested value
      // can't corrupt provider state) but shallow-merge self's, matching the
      // pre-cleanup semantics. Skip the clone when the parent has no userData,
      // which is the common case on the scroll hot path.
      userData:
        Object.keys(parent.userData).length > 0
          ? { ...structuredClone(parent.userData), ...self.userData }
          : { ...self.userData },
    }
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

  // Inherit parent transforms. Stable identity (useEffectEvent) so the
  // subscription isn't torn down and recreated on every render. getTransform
  // builds a fresh object per call, so storing the inherited transform by
  // reference is safe — nothing mutates it after it's handed to callbacks.
  const inheritParentTransform = useEffectEvent((transform: Transform) => {
    parentTransformRef.current = transform
    update()
  })
  useTransform(inheritParentTransform)

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
  deps: DependencyList = []
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
