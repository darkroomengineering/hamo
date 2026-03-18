# useTransform

A context-based transform accumulation system. `TransformProvider` tracks programmatic transforms (translate, rotate, scale) and propagates them down the component tree. `useTransform` lets child components read the accumulated transform or react to changes.

The primary use case is **scroll trigger compensation** — when a parent element is translated programmatically (e.g., parallax), child `useScrollTrigger` hooks need to know about that offset to compute accurate progress values.

## Usage

```jsx
import { useRef } from 'react'
import { TransformProvider, useTransform } from 'hamo'
import type { TransformRef } from 'hamo'

function ParallaxSection() {
  const transformRef = useRef<TransformRef>(null)

  // Set transforms imperatively (e.g., from a scroll callback)
  function onScroll(y) {
    transformRef.current?.setTranslate(0, y)
  }

  return (
    <TransformProvider ref={transformRef}>
      <ChildComponent />
    </TransformProvider>
  )
}

function ChildComponent() {
  // Read accumulated transform from all parent providers
  const getTransform = useTransform()
  const { translate } = getTransform()
  // translate.y reflects the parent's offset

  // Or react to changes:
  useTransform((transform) => {
    console.log('Parent moved to:', transform.translate.y)
  })

  return <div>Content</div>
}
```

## TransformProvider

Wraps a subtree with a transform context. Nested providers accumulate transforms:
- **Translate** and **rotate**: additive
- **Scale**: multiplicative

### Props

- `children`: (ReactNode) Child components.
- `ref`: (Ref\<TransformRef\>) Optional imperative handle.

### TransformRef Methods

- `setTranslate(x?, y?, z?)` — Set translation (defaults: 0).
- `setRotate(x?, y?, z?)` — Set rotation in degrees (defaults: 0).
- `setScale(x?, y?, z?)` — Set scale (defaults: 1).

## useTransform

### Without callback

Returns a `getTransform()` function to read the current accumulated transform on demand.

```jsx
const getTransform = useTransform()
const { translate, rotate, scale } = getTransform()
```

### With callback

Registers a callback that fires whenever any ancestor `TransformProvider` updates its transform.

```jsx
useTransform((transform) => {
  element.style.transform = `translateY(${transform.translate.y}px)`
})
```

### Parameters

- `callback`: (function, optional) Fired with the accumulated `Transform` on every change.
- `deps`: (array, default: `[]`) Dependencies for the callback effect.

### Return Value

Returns `getTransform` — a function that returns the current accumulated `Transform`.

## Transform Type

```ts
type Transform = {
  translate: { x: number; y: number; z: number }
  rotate: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
}
```

## Example: Nested Providers

```jsx
import { useRef } from 'react'
import { TransformProvider, useTransform } from 'hamo'
import type { TransformRef } from 'hamo'

function Outer() {
  const ref = useRef<TransformRef>(null)
  ref.current?.setTranslate(0, 100) // y = 100

  return (
    <TransformProvider ref={ref}>
      <Inner />
    </TransformProvider>
  )
}

function Inner() {
  const ref = useRef<TransformRef>(null)
  ref.current?.setTranslate(0, 50) // y = 50

  return (
    <TransformProvider ref={ref}>
      <Leaf />
    </TransformProvider>
  )
}

function Leaf() {
  const getTransform = useTransform()
  const { translate } = getTransform()
  // translate.y === 150 (100 + 50, accumulated from both parents)
}
```
