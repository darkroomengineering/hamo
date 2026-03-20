'use client'

import { useLenis } from 'lenis/react'
import {
  type CSSProperties,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react'
import { useWindowSize } from '../use-window-size'
import { scrollTriggerStore } from './store'

const COLORS = [
  '#3b82f6', // blue
  '#a855f7', // purple
  '#f59e0b', // amber
  '#14b8a6', // teal
  '#f97316', // orange
  '#ec4899', // pink
]

interface MinimapProps {
  width?: number
  zIndex?: number
  theme?: 'light' | 'dark'
}

export function Minimap({
  width = 200,
  zIndex = 99999,
  theme = 'dark',
}: MinimapProps) {
  const isDark = theme === 'dark'
  const containerRef = useRef<HTMLDivElement>(null!)
  const lenis = useLenis()
  const { width: windowWidth = 0, height: windowHeight = 0 } = useWindowSize()

  const triggers = useSyncExternalStore(
    (callback) => {
      const unbind = scrollTriggerStore.subscribe(callback)
      return unbind
    },
    () => scrollTriggerStore.getSnapshot(),
    () => scrollTriggerStore.getSnapshot()
  )

  // Track scroll via CSS custom property (no re-render)
  useEffect(() => {
    function updateScroll() {
      if (!containerRef.current) return
      const docHeight = lenis
        ? lenis.limit + windowHeight
        : document.documentElement.scrollHeight
      const scroll = lenis ? lenis.scroll : window.scrollY
      const progress =
        docHeight > windowHeight ? scroll / (docHeight - windowHeight) : 0
      containerRef.current.style.setProperty('--scroll', progress.toString())
    }

    updateScroll()

    if (lenis) {
      lenis.on('scroll', updateScroll)
      return () => {
        lenis.off('scroll', updateScroll)
      }
    }

    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateScroll)
    }
  }, [lenis, windowHeight])

  // Track body aspect ratio
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry || !containerRef.current) return
      const ratio = entry.contentRect.width / entry.contentRect.height
      containerRef.current.style.setProperty('--body-ratio', ratio.toFixed(4))
    })

    resizeObserver.observe(document.body)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const viewportRatio =
    windowWidth && windowHeight ? windowWidth / windowHeight : 1
  const minimapHeight = width / viewportRatio

  const docHeight = lenis
    ? lenis.limit + windowHeight
    : typeof document !== 'undefined'
      ? document.documentElement.scrollHeight
      : 1

  const fg = isDark ? '255,255,255' : '0,0,0'
  const bg = isDark ? '0,0,0' : '255,255,255'

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: '50%',
        right: 24,
        transform: 'translateY(-50%)',
        zIndex,
        fontFamily: 'ui-monospace, monospace',
        fontSize: 10,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          width,
          height: minimapHeight,
          borderRadius: 6,
          overflow: 'visible',
        }}
      >
        {/* Border */}
        <div
          style={{
            position: 'absolute',
            inset: -6,
            border: `1px solid rgba(${bg}, 0.5)`,
            borderRadius: 8,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Body */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            aspectRatio: 'var(--body-ratio)',
            transform:
              'translateY(calc(var(--scroll) * -100% + var(--scroll) * ' +
              minimapHeight +
              'px))',
            backgroundColor: `rgba(${bg}, 0.15)`,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            borderRadius: 4,
          }}
        />

        {/* Element rectangles */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            aspectRatio: 'var(--body-ratio)',
            transform:
              'translateY(calc(var(--scroll) * -100% + var(--scroll) * ' +
              minimapHeight +
              'px))',
            zIndex: 1,
          }}
        >
          {triggers.map((trigger, i) => {
            const color = COLORS[i % COLORS.length]
            const rectTop = (trigger.rect.top / docHeight) * 100
            const rectLeft = (trigger.rect.left / windowWidth) * 100
            const rectWidth = (trigger.rect.width / windowWidth) * 100
            const rectHeight = (trigger.rect.height / docHeight) * 100

            return (
              <div
                key={trigger.id}
                style={{
                  position: 'absolute',
                  top: `${rectTop}%`,
                  left: `${rectLeft}%`,
                  width: `${rectWidth}%`,
                  height: `${rectHeight}%`,
                  border: `1px solid ${color}`,
                  borderRadius: 1,
                  opacity: trigger.isActive ? 0.8 : 0.2,
                  transition: 'opacity 150ms',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
