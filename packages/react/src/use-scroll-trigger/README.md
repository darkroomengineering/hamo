# useScrollTrigger

A high-performance, transparent scroll progress tracker for React.

GSAP ScrollTrigger is powerful but it's a black box — you hand it an element and hope for the best. `useScrollTrigger` gives you the same scroll-triggered progress tracking with full visibility into how it works, what it reads, and when it fires.

## Philosophy

Every design decision serves performance and transparency:

- **No per-frame DOM reads.** Element positions are computed once (via `useRect`) and cached. GSAP calls `getBoundingClientRect()` on every scroll frame for every trigger — that forces layout recalculation and kills performance on pages with dozens of scroll-driven elements.
- **No React re-renders.** Progress updates flow through `useLazyState` and refs, never through `setState`. Your scroll callbacks fire at 60fps without touching the React render cycle.
- **No magic.** You get `progress`, `direction`, `isActive`, and `steps` — raw values you wire up yourself. No hidden timeline binding, no implicit CSS changes, no side effects you didn't ask for.
- **Composable.** Built on `useRect`, `useLazyState`, `useEffectEvent`, and `useTransform` — hooks you can use independently. If `useScrollTrigger` doesn't do what you want, you have the building blocks to make your own.

### TransformProvider: the trade-off

Because positions are cached (not read per-frame), programmatic transforms on a parent element (like parallax `translateY`) would make the cached position stale. `TransformProvider` solves this — you tell it what you moved, and child scroll triggers compensate automatically.

This is an explicit trade-off: one extra component wrapper in exchange for zero layout thrashing. On a scrollytelling page with 20+ triggers, this is the difference between smooth and janky.

## Usage

```jsx
import { useScrollTrigger } from 'hamo'

function FadeIn() {
  const elementRef = useRef(null)

  const [setRef] = useScrollTrigger({
    onProgress: ({ progress }) => {
      elementRef.current.style.opacity = `${progress}`
    },
  })

  return (
    <div ref={(node) => { elementRef.current = node; setRef(node) }}>
      Fades in as you scroll
    </div>
  )
}
```

## Parameters

### Options

- `start`: (string, default: `'bottom bottom'`) Start position: `"element-position viewport-position"`.
- `end`: (string, default: `'top top'`) End position: `"element-position viewport-position"`.
- `offset`: (number, default: `0`) Pixel offset added to element positions.
- `disabled`: (boolean, default: `false`) Disables the scroll trigger.
- `onEnter`: (function) Called when entering the trigger zone. Receives `{ progress, direction }`.
- `onLeave`: (function) Called when leaving the trigger zone. Receives `{ progress, direction }`.
- `onProgress`: (function) Called on every scroll update. Receives `{ height, isActive, progress, lastProgress, direction, steps }`.
- `steps`: (number, default: `1`) Subdivides progress into N discrete sub-ranges.
- `debug`: (boolean | string, default: `false`) Registers the trigger in the debug store. Pass a string to use as label in the Debugger minimap.
- `rect`: (Rect) External rect from `useRect` — pass this to share a single `useRect` across multiple triggers on the same element.

### Dependencies

- `deps`: (array, default: `[]`) Dependencies that trigger recalculation.

## Return Value

Returns `[setRef, rect]`:

1. `setRef` — Callback ref to attach to the target element.
2. `rect` — The element's current rect (from `useRect` internally).

## Position Syntax

Format: `"element-position viewport-position"`

| Keyword | Element | Viewport |
|---------|---------|----------|
| `top` | Top edge | Top of viewport |
| `center` | Vertical center | Center of viewport |
| `bottom` | Bottom edge | Bottom of viewport |
| `number` | Pixel offset from top | Pixel offset from top |

### Common Combinations

| Start / End | Description |
|-------------|-------------|
| `'bottom bottom'` / `'top top'` | Full element traversal (default) |
| `'bottom bottom'` / `'top center'` | From entering viewport to reaching center |
| `'center center'` / `'top top'` | From center alignment to reaching top |

## onProgress Callback Data

| Property | Type | Description |
|----------|------|-------------|
| `progress` | `number` | Clamped progress from 0 to 1 |
| `lastProgress` | `number` | Previous progress value |
| `direction` | `1 \| -1` | Scroll direction (1 = down, -1 = up) |
| `isActive` | `boolean` | Whether progress is between 0 and 1 |
| `height` | `number` | Scroll distance in pixels between start and end |
| `steps` | `number[]` | Array of per-step progress values |

## How It Works

```
useScrollTrigger
  ├── useRect()         → computes element position once, caches it
  ├── useWindowSize()   → viewport height for position keywords
  ├── useTransform()    → reads parent transform offset (if any)
  ├── useLenis()        → subscribes to Lenis scroll (or falls back to native)
  ├── useLazyState()    → tracks progress without re-renders
  └── useEffectEvent()  → stable callbacks, no effect churn

On every scroll tick:
  1. Read scroll position (from Lenis or window.scrollY)
  2. Subtract parent transform offset (from TransformProvider)
  3. Map scroll into [0, 1] progress using cached element position
  4. Fire onEnter/onLeave/onProgress if progress changed
  5. Zero DOM reads. Zero re-renders.
```

## Examples

### Enter / Leave with Direction

```jsx
import { useScrollTrigger } from 'hamo'

function Section() {
  const [setRef] = useScrollTrigger({
    onEnter: ({ direction }) => {
      console.log(direction === 1 ? 'Entered scrolling down' : 'Entered scrolling up')
    },
    onLeave: ({ direction }) => {
      console.log(direction === 1 ? 'Left scrolling down' : 'Left scrolling up')
    },
  })

  return <div ref={setRef}>Tracked section</div>
}
```

### Steps for Staggered Animations

```jsx
import { useRef } from 'react'
import { useScrollTrigger } from 'hamo'

function StaggeredList() {
  const itemRefs = useRef([])

  const [setRef] = useScrollTrigger({
    steps: 5,
    onProgress: ({ steps }) => {
      steps.forEach((stepProgress, i) => {
        if (itemRefs.current[i]) {
          itemRefs.current[i].style.opacity = `${stepProgress}`
          itemRefs.current[i].style.transform = `translateY(${(1 - stepProgress) * 20}px)`
        }
      })
    },
  })

  return (
    <ul ref={setRef}>
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} ref={(el) => { itemRefs.current[i] = el }}>
          Item {i + 1}
        </li>
      ))}
    </ul>
  )
}
```

### With Lenis

When Lenis is installed, the hook automatically uses it. No configuration needed.

```jsx
import { ReactLenis } from 'lenis/react'
import { useScrollTrigger } from 'hamo'

function App() {
  return (
    <ReactLenis root>
      <AnimatedSection />
    </ReactLenis>
  )
}

function AnimatedSection() {
  const elementRef = useRef(null)

  const [setRef] = useScrollTrigger({
    onProgress: ({ progress }) => {
      elementRef.current.style.transform = `translateX(${progress * 100}px)`
    },
  })

  return (
    <div ref={(node) => { elementRef.current = node; setRef(node) }}>
      Slides in with smooth scroll
    </div>
  )
}
```

### CSS Custom Property

```jsx
import { useScrollTrigger } from 'hamo'

function ParallaxSection() {
  const elementRef = useRef(null)

  const [setRef] = useScrollTrigger({
    onProgress: ({ progress }) => {
      elementRef.current.style.setProperty('--progress', `${progress}`)
    },
  })

  return (
    <div
      ref={(node) => { elementRef.current = node; setRef(node) }}
      style={{ transform: 'translateY(calc(var(--progress, 0) * -50px))' }}
    >
      Parallax content
    </div>
  )
}
```

### With TransformProvider (Parallax Compensation)

When a parent is translated programmatically, child scroll triggers need to know. Wrap the parent in `TransformProvider` and report your transforms — children compensate automatically.

```jsx
import { useRef } from 'react'
import { useScrollTrigger, TransformProvider } from 'hamo'
import type { TransformRef } from 'hamo'

function ParallaxWrapper({ children }) {
  const transformRef = useRef<TransformRef>(null)
  const elementRef = useRef(null)

  const [setRef] = useScrollTrigger({
    onProgress: ({ progress }) => {
      const y = (progress - 0.5) * -100
      transformRef.current?.setTranslate(0, y)
      elementRef.current.style.transform = `translateY(${y}px)`
    },
  })

  return (
    <TransformProvider ref={transformRef}>
      <div ref={(node) => { elementRef.current = node; setRef(node) }}>
        {children}
      </div>
    </TransformProvider>
  )
}

function ChildTrigger() {
  const [setRef] = useScrollTrigger({
    onProgress: ({ progress }) => {
      // Accurate despite parent parallax — no getBoundingClientRect needed
      console.log('progress:', progress)
    },
  })

  return <div ref={setRef}>Child content</div>
}

function Page() {
  return (
    <ParallaxWrapper>
      <ChildTrigger />
    </ParallaxWrapper>
  )
}
```

### Progressive Text Reveal

```jsx
import { useRef } from 'react'
import { useScrollTrigger } from 'hamo'

function TextReveal({ text }) {
  const containerRef = useRef(null)
  const words = text.split(' ')

  const [setRef] = useScrollTrigger({
    start: 'bottom bottom',
    end: 'center center',
    steps: words.length,
    onProgress: ({ steps }) => {
      if (!containerRef.current) return
      const spans = containerRef.current.querySelectorAll('span')
      spans.forEach((span, i) => {
        span.style.opacity = `${steps[i]}`
      })
    },
  })

  return (
    <p ref={(node) => { containerRef.current = node; setRef(node) }}>
      {words.map((word, i) => (
        <span key={i} style={{ opacity: 0 }}>
          {word}{' '}
        </span>
      ))}
    </p>
  )
}
```

## Debugger

A minimap overlay that visualizes all active scroll triggers on the page. Each trigger with `debug` enabled appears as a colored rectangle (element position) and a bar (start/end range). Hover a rectangle to see a tooltip with the trigger's id, start/end positions, progress, and active state.

```jsx
import { Debugger } from 'hamo/scroll-trigger'

function App() {
  return (
    <>
      <Debugger theme="light" />
      {/* your content */}
    </>
  )
}
```

### Props

- `theme`: (`'light' | 'dark'`, default: `'dark'`) Color theme.

### How it works

Triggers with `debug` enabled register themselves in a shared store. The Debugger subscribes to that store and renders a fixed minimap that:

- Mirrors the page body shape using the body's aspect ratio
- Scrolls in sync via a CSS custom property (`--p`)
- Shows each trigger's element as a colored rectangle, offset by `translateY` from `TransformProvider`
- Shows each trigger's start/end scroll range as a colored bar aligned to its element
- Displays a tooltip on hover with trigger details (id, start, end, progress, active)

### Enabling debug on a trigger

```jsx
const [setRef] = useScrollTrigger({
  start: 'bottom bottom',
  end: 'top top',
  debug: 'my-section', // label shown in tooltip
  onProgress: ({ progress }) => { /* ... */ },
})
```

## vs GSAP ScrollTrigger

| | GSAP ScrollTrigger | useScrollTrigger |
|---|---|---|
| DOM reads per frame | `getBoundingClientRect()` on every tick | Zero — positions cached via `useRect` |
| React re-renders | N/A (not React-aware) | Zero — updates via refs and `useLazyState` |
| Lenis integration | Manual `scrollerProxy` setup | Automatic |
| Transform awareness | Implicit (reads DOM) | Explicit via `TransformProvider` |
| Bundle size | ~55KB (GSAP core + plugin) | ~1KB (inlined in hamo) |
| Pinning, scrub, snap | Yes | No — use GSAP for those |
| License | Custom (restrictions on some commercial use) | MIT |
| Transparency | Black box | Every hook is composable and inspectable |
