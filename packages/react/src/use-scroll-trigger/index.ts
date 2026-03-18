'use client'

import { useEffectEvent } from '../use-effect-event'
import { useLazyState } from '../use-lazy-state'
import { type Rect, useRect } from '../use-rect'
import { useTransform } from '../use-transform'
import { useWindowSize } from '../use-window-size'
import { useLenis } from 'lenis/react'
import { useEffect } from 'react'

// Math utilities (inlined to avoid external dependency)
function clamp(min: number, input: number, max: number): number {
  return Math.max(min, Math.min(input, max))
}

function mapRange(
  inMin: number,
  inMax: number,
  input: number,
  outMin: number,
  outMax: number
): number {
  return ((input - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' || !Number.isNaN(value)
}

export function modulo(n: number, d: number) {
  if (d === 0) return n
  if (d < 0) return Number.NaN
  return ((n % d) + d) % d
}

type TriggerPosition = 'top' | 'center' | 'bottom' | number
type TriggerPositionCombination = `${TriggerPosition} ${TriggerPosition}`

export type UseScrollTriggerOptions = {
  /** External rect from useRect — pass this to share a single useRect across multiple triggers on the same element */
  rect?: Rect
  /** Start position: "element-position viewport-position" (default: "bottom bottom") */
  start?: TriggerPositionCombination
  /** End position: "element-position viewport-position" (default: "top top") */
  end?: TriggerPositionCombination
  /** Pixel offset added to element positions */
  offset?: number
  /** Disable the scroll trigger */
  disabled?: boolean
  /** Called when element enters the trigger zone */
  onEnter?: (data: { progress: number; direction: 1 | -1 }) => void
  /** Called when element leaves the trigger zone */
  onLeave?: (data: { progress: number; direction: 1 | -1 }) => void
  /** Called on every scroll progress update */
  onProgress?: (data: {
    height: number
    isActive: boolean
    progress: number
    lastProgress: number
    direction: 1 | -1
    steps: number[]
  }) => void
  /** Number of discrete steps to subdivide progress into */
  steps?: number
}

/**
 * Hook for creating scroll-based animations and triggers.
 *
 * Provides scroll-triggered progress tracking with GSAP ScrollTrigger-like
 * position syntax. Integrates with Lenis when available, falls back to
 * native scroll events.
 *
 * Position format: "element-position viewport-position"
 * Available positions: 'top', 'center', 'bottom', or pixel values
 *
 * @param options - Configuration options
 * @param deps - Dependencies that trigger recalculation
 *
 * @returns [setRef, rect] - A ref setter (undefined if external rect provided) and the element's rect
 *
 * @example
 * ```tsx
 * // Basic usage — creates its own useRect internally
 * const [setRef] = useScrollTrigger({
 *   onProgress: ({ progress }) => console.log(progress),
 * })
 * return <div ref={setRef}>...</div>
 * ```
 *
 * @example
 * ```tsx
 * // Shared rect — multiple triggers on the same element, single useRect
 * const [setRef, rect] = useRect()
 * useScrollTrigger({ rect, end: 'center center', onEnter: handleEnter })
 * useScrollTrigger({ rect, start: 'center center', onProgress: handleParallax })
 * return <div ref={setRef}>...</div>
 * ```
 */
export function useScrollTrigger(
  {
    rect: externalRect,
    start = 'bottom bottom',
    end = 'top top',
    offset = 0,
    disabled = false,
    onEnter,
    onLeave,
    onProgress,
    steps = 1,
  }: UseScrollTriggerOptions = {},
  deps: unknown[] = []
) {
  const [setRectRef, internalRect] = useRect()
  const rect = externalRect ?? internalRect
  const getTransform = useTransform()
  const lenis = useLenis()

  const { height: windowHeight = 0 } = useWindowSize()

  const isReady = rect?.top !== undefined

  const [elementStartKeyword, viewportStartKeyword] =
    typeof start === 'string' ? start.split(' ') : [start]
  const [elementEndKeyword, viewportEndKeyword] =
    typeof end === 'string' ? end.split(' ') : [end]

  let viewportStart = isNumber(viewportStartKeyword)
    ? Number.parseFloat(viewportStartKeyword as string)
    : 0
  if (viewportStartKeyword === 'top') viewportStart = 0
  if (viewportStartKeyword === 'center') viewportStart = windowHeight * 0.5
  if (viewportStartKeyword === 'bottom') viewportStart = windowHeight

  let viewportEnd = isNumber(viewportEndKeyword)
    ? Number.parseFloat(viewportEndKeyword as string)
    : 0
  if (viewportEndKeyword === 'top') viewportEnd = 0
  if (viewportEndKeyword === 'center') viewportEnd = windowHeight * 0.5
  if (viewportEndKeyword === 'bottom') viewportEnd = windowHeight

  let elementStart = isNumber(elementStartKeyword)
    ? Number.parseFloat(elementStartKeyword as string)
    : rect?.bottom || 0
  if (elementStartKeyword === 'top') elementStart = rect?.top || 0
  if (elementStartKeyword === 'center')
    elementStart = (rect?.top || 0) + (rect?.height || 0) * 0.5
  if (elementStartKeyword === 'bottom') elementStart = rect?.bottom || 0

  elementStart += offset

  let elementEnd = isNumber(elementEndKeyword)
    ? Number.parseFloat(elementEndKeyword as string)
    : rect?.top || 0
  if (elementEndKeyword === 'top') elementEnd = rect?.top || 0
  if (elementEndKeyword === 'center')
    elementEnd = (rect?.top || 0) + (rect?.height || 0) * 0.5
  if (elementEndKeyword === 'bottom') elementEnd = rect?.bottom || 0

  elementEnd += offset

  const startValue = elementStart - viewportStart
  const endValue = elementEnd - viewportEnd

  const handleProgress = useEffectEvent(
    (progress: number, lastProgress: number) => {
      const direction: 1 | -1 = progress >= lastProgress ? 1 : -1
      onProgress?.({
        height: endValue - startValue,
        isActive: progress >= 0 && progress <= 1,
        progress: clamp(0, progress, 1),
        lastProgress,
        direction,
        steps: Array.from({ length: steps }).map((_, i) =>
          clamp(0, mapRange(i / steps, (i + 1) / steps, progress, 0, 1), 1)
        ),
      })
    }
  )

  const handleEnter = useEffectEvent(
    (progress: number, lastProgress: number) => {
      const direction: 1 | -1 = progress >= lastProgress ? 1 : -1
      onEnter?.({ progress: clamp(0, progress, 1), direction })
    }
  )

  const handleLeave = useEffectEvent(
    (progress: number, lastProgress: number) => {
      const direction: 1 | -1 = progress >= lastProgress ? 1 : -1
      onLeave?.({ progress: clamp(0, progress, 1), direction })
    }
  )

  const [setProgress] = useLazyState<number>(
    Number.NaN,
    (progress: number, lastProgress: number | undefined) => {
      if (Number.isNaN(progress) || progress === undefined) return
      if (lastProgress === undefined) return

      if (
        (progress >= 0 && lastProgress < 0) ||
        (progress <= 1 && lastProgress > 1)
      ) {
        handleEnter(progress, lastProgress)
      }

      if (!(clamp(0, progress, 1) === clamp(0, lastProgress, 1))) {
        handleProgress(progress, lastProgress)
      }

      if (
        (progress < 0 && lastProgress >= 0) ||
        (progress > 1 && lastProgress <= 1)
      ) {
        handleLeave(progress, lastProgress)
      }
    },
    [endValue, startValue, steps]
  )

  const update = useEffectEvent(() => {
    if (disabled) return
    if (!isReady) return

    const scroll = lenis ? Math.floor(lenis.scroll) : window.scrollY
    const { translate } = getTransform()

    // support for Lenis infinite scroll
    const progress = mapRange(
      0,
      endValue - startValue,
      modulo(scroll - translate.y - startValue, lenis?.limit ?? 0),
      0,
      1
    )

    setProgress(progress)
  })

  useEffect(() => {
    if (lenis) {
      lenis.on('scroll', update)
      return () => {
        lenis.off('scroll', update)
      }
    }

    // Fallback to native scroll
    update()
    window.addEventListener('scroll', update, false)

    return () => {
      window.removeEventListener('scroll', update, false)
    }
  }, [lenis, update, ...deps])

  // Recalculate when parent transforms change
  useTransform(update)

  // Run update when deps change
  useEffect(update, [...deps])

  return [setRectRef, rect]
}
