import {
  useWindowSize,
  useWindowWidth,
  useWindowHeight,
  useMediaQuery,
  useResizeObserver,
  useRect,
  useIntersectionObserver,
  useDebouncedState,
  useLazyState,
} from 'hamo'
import { useRef, useState } from 'react'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      <div className="section-content">{children}</div>
    </section>
  )
}

function Value({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="value">
      <span className="value-label">{label}</span>
      <span className="value-data">{value ?? '—'}</span>
    </div>
  )
}

function WindowSizeDemo() {
  const { width, height, dpr } = useWindowSize()

  // Selective hooks - these only re-render when their specific value changes
  const selectiveWidth = useWindowWidth()
  const selectiveHeight = useWindowHeight()

  return (
    <Section title="useWindowSize">
      <p className="description">
        Tracks window dimensions using <code>useSyncExternalStore</code> for concurrent-safe subscriptions.
      </p>
      <div className="values-grid">
        <Value label="width" value={`${width}px`} />
        <Value label="height" value={`${height}px`} />
        <Value label="dpr" value={dpr?.toFixed(2)} />
      </div>
      <h3>Selective Hooks</h3>
      <p className="description">
        Use <code>useWindowWidth()</code> or <code>useWindowHeight()</code> to only re-render when that specific dimension changes.
      </p>
      <div className="values-grid">
        <Value label="useWindowWidth()" value={`${selectiveWidth}px`} />
        <Value label="useWindowHeight()" value={`${selectiveHeight}px`} />
      </div>
    </Section>
  )
}

function MediaQueryDemo() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <Section title="useMediaQuery">
      <p className="description">
        Subscribe to CSS media queries with <code>useSyncExternalStore</code>. Supports SSR fallback as second parameter.
      </p>
      <div className="values-grid">
        <Value label="isMobile (≤768px)" value={isMobile ? '✓' : '✗'} />
        <Value label="isTablet (769-1024px)" value={isTablet ? '✓' : '✗'} />
        <Value label="isDesktop (≥1025px)" value={isDesktop ? '✓' : '✗'} />
        <Value label="prefersDark" value={prefersDark ? '✓' : '✗'} />
        <Value label="prefersReducedMotion" value={prefersReducedMotion ? '✓' : '✗'} />
      </div>
    </Section>
  )
}

function ResizeObserverDemo() {
  const displayRef = useRef<HTMLSpanElement>(null)
  const [setRef] = useResizeObserver({
    callback: (entry) => {
      if (displayRef.current && entry) {
        const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0]
        displayRef.current.textContent = `${Math.round(width)} × ${Math.round(height)}`
      }
    },
  })

  return (
    <Section title="useResizeObserver">
      <p className="description">
        Observe element size changes using a shared <code>ResizeObserver</code> instance for better performance.
      </p>
      <div
        ref={setRef}
        className="resize-box"
      >
        <span>Resize me!</span>
        <span className="resize-value" ref={displayRef}>—</span>
      </div>
    </Section>
  )
}

function RectDemo() {
  const [setRef, rect] = useRect({
    ignoreTransform: false,
    ignoreSticky: true,
  })

  return (
    <Section title="useRect">
      <p className="description">
        Track element position and dimensions within the page. Scroll to see values update.
      </p>
      <div ref={setRef} className="rect-box">
        <div className="values-grid compact">
          <Value label="top" value={rect.top !== undefined ? `${Math.round(rect.top)}px` : '—'} />
          <Value label="left" value={rect.left !== undefined ? `${Math.round(rect.left)}px` : '—'} />
          <Value label="width" value={rect.width !== undefined ? `${Math.round(rect.width)}px` : '—'} />
          <Value label="height" value={rect.height !== undefined ? `${Math.round(rect.height)}px` : '—'} />
        </div>
      </div>
    </Section>
  )
}

function IntersectionObserverDemo() {
  const [setRef, entry] = useIntersectionObserver({
    threshold: 0.5,
  })

  const isIntersecting = entry?.isIntersecting ?? false
  const ratio = entry?.intersectionRatio ?? 0

  return (
    <Section title="useIntersectionObserver">
      <p className="description">
        Observe element visibility. The box below changes when 50% visible.
      </p>
      <div className="intersection-spacer">
        <span>↓ Scroll down ↓</span>
      </div>
      <div
        ref={setRef}
        className="intersection-box"
        data-visible={isIntersecting}
      >
        <Value label="isIntersecting" value={isIntersecting ? '✓ Yes' : '✗ No'} />
        <Value label="ratio" value={`${(ratio * 100).toFixed(0)}%`} />
      </div>
    </Section>
  )
}

function DebouncedStateDemo() {
  const [instant, setInstant] = useState(0)
  const [debounced, setDebounced] = useDebouncedState(0, 500)

  return (
    <Section title="useDebouncedState">
      <p className="description">
        State that debounces updates. Click rapidly to see the difference.
      </p>
      <div className="button-row">
        <button
          type="button"
          onClick={() => {
            setInstant(v => v + 1)
            setDebounced(v => v + 1)
          }}
        >
          Increment Both
        </button>
        <button
          type="button"
          onClick={() => {
            setInstant(0)
            setDebounced(0)
          }}
        >
          Reset
        </button>
      </div>
      <div className="values-grid">
        <Value label="Instant" value={instant} />
        <Value label="Debounced (500ms)" value={debounced} />
      </div>
    </Section>
  )
}

function LazyStateDemo() {
  const renderCountRef = useRef(0)
  const displayRef = useRef<HTMLSpanElement>(null)
  const [set, get] = useLazyState(0, (value) => {
    if (displayRef.current) {
      displayRef.current.textContent = String(value)
    }
  })

  // This increments on every render
  renderCountRef.current++

  return (
    <Section title="useLazyState">
      <p className="description">
        Track state changes via callback without triggering re-renders. Useful for animations.
      </p>
      <div className="button-row">
        <button type="button" onClick={() => set(v => v + 1)}>
          Increment (no re-render)
        </button>
        <button type="button" onClick={() => set(0)}>
          Reset
        </button>
      </div>
      <div className="values-grid">
        <Value label="Lazy Value" value={<span ref={displayRef}>{get()}</span>} />
        <Value label="Component Renders" value={renderCountRef.current} />
      </div>
      <p className="hint">
        Notice: incrementing doesn't increase render count!
      </p>
    </Section>
  )
}

export default function App() {
  return (
    <div className="playground">
      <header>
        <h1>hamo hooks playground</h1>
        <p>Interactive demos for all hooks. Resize the window, scroll around, and click buttons to test.</p>
      </header>

      <WindowSizeDemo />
      <MediaQueryDemo />
      <ResizeObserverDemo />
      <RectDemo />
      <DebouncedStateDemo />
      <LazyStateDemo />
      <IntersectionObserverDemo />

      <footer>
        <p>
          <a href="https://github.com/darkroomengineering/hamo" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          {' · '}
          <a href="https://www.npmjs.com/package/hamo" target="_blank" rel="noopener noreferrer">
            npm
          </a>
        </p>
      </footer>
    </div>
  )
}
