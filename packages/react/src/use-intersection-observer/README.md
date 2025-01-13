# useIntersectionObserver

A React hook that oberves element visibility using IntersectionObserver.

## Usage

```tsx
import { useIntersectionObserver } from '@darkroom.engineering/hamo'

function App() {
  const [setElement, entry] = useIntersectionObserver()

  console.log(entry?.isIntersecting)

  return <div ref={setElement} />
}
```

## Parameters

- `root` (optional): The element to observe.
- `rootMargin` (optional, default: `0px`): The margin around the root element.
- `threshold` (optional, default: `0`): The threshold at which the callback is triggered.
- `once` (optional, default: `false`): If true, the observer will disconnect after the element is once intersected.
- `lazy` (optional, default: `false`): If true, the observer will not trigger state changes.
- `callback` (optional): The callback function to call when the element is intersected.
- `deps` (optional): The dependencies to be used in the callback function.

## Return Value

An array containing the `setElement` function and the `entry` state.

- `setElement` (function): A function to set the ref of the element to observe.
- `entry` (IntersectionObserverEntry | (entry: IntersectionObserverEntry) => void): The current intersection observer entry.
