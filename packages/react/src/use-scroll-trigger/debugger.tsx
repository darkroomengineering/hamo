'use client'

import { useLenis } from 'lenis/react'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useWindowSize } from '../use-window-size'
import { scrollTriggerStore } from './store'

const COLORS = [
  '#3b82f6',
  '#a855f7',
  '#f59e0b',
  '#14b8a6',
  '#f97316',
  '#ec4899',
]

const BAR_W = 4

interface DebuggerProps {
  theme?: 'light' | 'dark'
}

export function Debugger({ theme = 'dark' }: DebuggerProps) {
  const fg = theme === 'dark' ? '0,0,0' : '255,255,255'
  const bg = theme === 'dark' ? '255,255,255' : '0,0,0'
  const [hovered, setHovered] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null!)
  const lenis = useLenis()
  const { width: ww = 0, height: wh = 0 } = useWindowSize()

  const triggers = useSyncExternalStore(
    (cb) => scrollTriggerStore.subscribe(cb),
    () => scrollTriggerStore.getSnapshot(),
    () => scrollTriggerStore.getSnapshot()
  )

  useEffect(() => {
    function update() {
      if (!ref.current) return
      const docH = lenis
        ? lenis.limit + wh
        : document.documentElement.scrollHeight
      const scroll = lenis ? lenis.scroll : window.scrollY
      const p = docH > wh ? scroll / (docH - wh) : 0
      ref.current.style.setProperty('--p', p.toString())
    }

    update()

    if (lenis) {
      lenis.on('scroll', update)
      return () => {
        lenis.off('scroll', update)
      }
    }

    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
    }
  }, [lenis, wh])

  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => {
      if (!e || !ref.current) return
      ref.current.style.setProperty(
        '--br',
        (e.contentRect.width / e.contentRect.height).toFixed(4)
      )
    })
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [])

  const vr = ww && wh ? ww / wh : 1
  const h = 200 / vr
  const docH = lenis
    ? lenis.limit + wh
    : typeof document !== 'undefined'
      ? document.documentElement.scrollHeight
      : 1

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: '50%',
        right: 48,
        width: 200,
        height: h,
        transform: 'translateY(-50%)',
        zIndex: 99999,
        fontFamily: 'ui-monospace, monospace',
        fontSize: 10,
      }}
    >
      {/* Body */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          aspectRatio: 'var(--br)',
          transform: `translateY(calc(var(--p) * -100% + var(--p) * ${h}px))`,
          background: `rgba(${fg},0.1)`,
          backdropFilter: 'blur(4px)',
          borderRadius: 4,
        }}
      >
        {triggers.map((t, i) => {
          const color = COLORS[i % COLORS.length]
          const top = ((t.rect.top + t.translateY) / docH) * 100
          const left = (t.rect.left / ww) * 100
          const w = (t.rect.width / ww) * 100
          const rh = (t.rect.height / docH) * 100
          const startPct = ((t.startPx + t.translateY) / docH) * 100
          const endPct = ((t.endPx + t.translateY) / docH) * 100
          const barTop = Math.min(startPct, endPct)
          const barH = Math.abs(endPct - startPct)

          const isHovered = hovered === t.id

          return (
            <div key={t.id} style={{ zIndex: isHovered ? 1 : 0 }}>
              {/* Element rectangle */}
              <div
                onMouseEnter={() => setHovered(t.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: 'absolute',
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${w}%`,
                  height: `${rh}%`,
                  border: `1px solid ${color}`,
                  opacity: isHovered ? 1 : t.isActive ? 0.8 : 0.2,
                  transition: 'opacity 150ms',
                  backgroundColor: `rgba(${fg},0.1)`,
                  cursor: 'default',
                  zIndex: isHovered ? 1 : 0,
                }}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: 0,
                      marginBottom: 4,
                      padding: '4px 6px',
                      background: `rgba(${bg},0.9)`,
                      color: `rgb(${fg})`,
                      borderRadius: 3,
                      whiteSpace: 'nowrap',
                      lineHeight: 1.4,
                      pointerEvents: 'none',
                    }}
                  >
                    <strong>{t.id}</strong>
                    <br />
                    start: {t.start} ({Math.round(t.startPx)}px)
                    <br />
                    end: {t.end} ({Math.round(t.endPx)}px)
                    <br />
                    progress: {t.progress.toFixed(3)}
                    <br />
                    active: {t.isActive ? 'true' : 'false'}
                  </div>
                )}
              </div>
              {/* Bar */}
              <div
                style={{
                  position: 'absolute',
                  top: `${barTop}%`,
                  left: `${left}%`,
                  width: BAR_W,
                  height: `${barH}%`,
                  minHeight: 4,
                  borderRadius: BAR_W / 2,
                  background: color,
                  opacity: isHovered ? 1 : t.isActive ? 0.9 : 0.3,
                  transition: 'opacity 150ms',
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Border */}
      <div
        style={{
          position: 'absolute',
          inset: -6,
          border: `1px solid rgba(${fg},0.5)`,
          borderRadius: 6,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
