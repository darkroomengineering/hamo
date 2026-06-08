'use client'

import { useLenis } from 'lenis/react'
import { useEffect, useId } from 'react'
import { useEffectEvent } from '../use-effect-event'
import { useLazyState } from '../use-lazy-state'
import { type Rect, useRect } from '../use-rect'
import { useTransform } from '../use-transform'
import { useWindowSize } from '../use-window-size'
import { scrollTriggerStore } from './store'

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

// Resolves a trigger position keyword ('top' | 'center' | 'bottom') to a pixel
// value against the provided anchors, or parses a numeric string. Falls back to
// 0 for anything unrecognized.
function resolveAnchor(
  keyword: string | number | undefined,
  anchors: { top: number; center: number; bottom: number }
): number {
  if (typeof keyword === 'number') return keyword
  if (keyword === 'top') return anchors.top
  if (keyword === 'center') return anchors.center
  if (keyword === 'bottom') return anchors.bottom
  const parsed = Number.parseFloat(keyword ?? '')
  return Number.isFinite(parsed) ? parsed : 0
}

function modulo(n: number, d: number) {
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
  /** Enable debug mode — registers this trigger to the Minimap. Pass a string to use as label. */
  debug?: boolean | string
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
    debug = false,
  }: UseScrollTriggerOptions = {},
  deps: unknown[] = []
) {
  const [setRectRef, internalRect] = useRect({})
  const rect = externalRect ?? internalRect
  const getTransform = useTransform()
  const lenis = useLenis()
  const autoId = useId()
  const debugId = typeof debug === 'string' ? debug : autoId

  const { height: windowHeight = 0 } = useWindowSize()

  const isReady = rect?.top !== undefined

  const [elementStartKeyword, viewportStartKeyword] =
    typeof start === 'string' ? start.split(' ') : [start]
  const [elementEndKeyword, viewportEndKeyword] =
    typeof end === 'string' ? end.split(' ') : [end]

  const viewportAnchors = {
    top: 0,
    center: windowHeight * 0.5,
    bottom: windowHeight,
  }
  const viewportStart = resolveAnchor(viewportStartKeyword, viewportAnchors)
  const viewportEnd = resolveAnchor(viewportEndKeyword, viewportAnchors)

  const elementTop = rect?.top || 0
  const elementAnchors = {
    top: elementTop,
    center: elementTop + (rect?.height || 0) * 0.5,
    bottom: rect?.bottom || 0,
  }
  const elementStart =
    resolveAnchor(elementStartKeyword, elementAnchors) + offset
  const elementEnd = resolveAnchor(elementEndKeyword, elementAnchors) + offset

  const startValue = elementStart - viewportStart
  const endValue = elementEnd - viewportEnd

  const handleProgress = useEffectEvent(
    (progress: number, lastProgress: number) => {
      const direction: 1 | -1 = progress >= lastProgress ? 1 : -1
      const clampedProgress = clamp(0, progress, 1)
      const isActive = progress >= 0 && progress <= 1

      onProgress?.({
        height: endValue - startValue,
        isActive,
        progress: clampedProgress,
        lastProgress,
        direction,
        steps: Array.from({ length: steps }).map((_, i) =>
          clamp(0, mapRange(i / steps, (i + 1) / steps, progress, 0, 1), 1)
        ),
      })

      if (debug) {
        const { translate } = getTransform()
        scrollTriggerStore.update(debugId, {
          progress: clampedProgress,
          isActive,
          startPx: startValue,
          endPx: endValue,
          rect: {
            top: rect?.top || 0,
            left: rect?.left || 0,
            width: rect?.width || 0,
            height: rect?.height || 0,
          },
          translateY: translate.y,
        })
      }
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

    // modulo wraps the scroll position for Lenis infinite scroll; with no Lenis
    // limit (limit ?? 0 === 0) modulo is a no-op and this reduces to subtraction
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

  // Run update when deps change (update is a stable useEffectEvent)
  useEffect(update, [update, ...deps])

  // Debug: register/unregister from store
  // biome-ignore lint/correctness/useExhaustiveDependencies: registers a one-time snapshot per trigger; the sync effect below keeps positions/rect current
  useEffect(() => {
    if (!debug) return

    scrollTriggerStore.register(debugId, {
      id: debugId,
      start,
      end,
      startPx: startValue,
      endPx: endValue,
      progress: 0,
      isActive: false,
      rect: {
        top: rect?.top || 0,
        left: rect?.left || 0,
        width: rect?.width || 0,
        height: rect?.height || 0,
      },
      translateY: 0,
    })

    return () => {
      scrollTriggerStore.unregister(debugId)
    }
  }, [debug, debugId])

  // Debug: sync store when rect/positions change
  useEffect(() => {
    if (!debug) return

    scrollTriggerStore.update(debugId, {
      start,
      end,
      startPx: startValue,
      endPx: endValue,
      rect: {
        top: rect?.top || 0,
        left: rect?.left || 0,
        width: rect?.width || 0,
        height: rect?.height || 0,
      },
    })
  }, [
    debug,
    debugId,
    start,
    end,
    startValue,
    endValue,
    rect?.top,
    rect?.left,
    rect?.width,
    rect?.height,
  ])

  return [setRectRef, rect] as const
}
