/**
 * SSR safety tests.
 *
 * Each browser hook is rendered to a string via renderToString(). Effects do
 * not run during SSR, so the render path must not throw even when browser
 * globals (window, document, ResizeObserver, …) are absent.
 *
 * These tests prove that hamo hooks are safe to use in server-rendered
 * React trees (Next.js App Router, Remix, etc.).
 */

import { describe, expect, it } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { useIntersectionObserver } from '../src/use-intersection-observer'
import { useMediaQuery } from '../src/use-media-query'
import { useRect } from '../src/use-rect'
import { useResizeObserver } from '../src/use-resize-observer'
import { useWindowSize } from '../src/use-window-size'

// ---------------------------------------------------------------------------
// Tiny wrapper components — the hook is called; the result is discarded.
// The only assertion is: renderToString returns a string without throwing.
// ---------------------------------------------------------------------------

function WindowSizeSSR() {
  const { width, height, dpr } = useWindowSize()
  return (
    <span>
      {width}-{height}-{dpr}
    </span>
  )
}

function MediaQuerySSR() {
  const match = useMediaQuery('(min-width: 768px)')
  return <span>{String(match)}</span>
}

function ResizeObserverSSR() {
  const [, entry] = useResizeObserver()
  return <span>{String(entry)}</span>
}

function RectSSR() {
  const [, rect] = useRect()
  return <span>{String(rect)}</span>
}

function IntersectionObserverSSR() {
  const [, entry] = useIntersectionObserver()
  return <span>{String(entry)}</span>
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SSR safety', () => {
  it('useWindowSize renders to string without throwing', () => {
    const html = renderToString(<WindowSizeSSR />)
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(0)
  })

  it('useMediaQuery renders to string without throwing', () => {
    const html = renderToString(<MediaQuerySSR />)
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(0)
  })

  it('useResizeObserver renders to string without throwing', () => {
    const html = renderToString(<ResizeObserverSSR />)
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(0)
  })

  it('useRect renders to string without throwing', () => {
    const html = renderToString(<RectSSR />)
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(0)
  })

  it('useIntersectionObserver renders to string without throwing', () => {
    const html = renderToString(<IntersectionObserverSSR />)
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(0)
  })
})
