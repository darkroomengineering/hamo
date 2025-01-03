# useResizeObserver

A React hook that listens to changes in the element size and provides the current width and height.

## Usage

### Basic

```tsx
import { useResizeObserver } from '@darkroom.engineering/hamo'

// Basic usage
const [setResizeObserverRef, resizeObserver] = useResizeObserver()

// Lazy usage
const [setResizeObserverRef] = useResizeObserver({ 
    lazy: true,
    callback: (entry) => {
      console.log(entry)
    },
  })

return <div ref={setResizeObserverRef} />
```

## Parameters

- `parameters` (object):
  - `lazy` (optional, default: `false`): If true, the resize observer will not trigger state changes.
  - `callback` (optional): The callback function to call when the element size changes.
  - `options` (optional): The options to pass to the `ResizeObserver.observe` method. See [ResizeObserver.observe options](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe#options) for more information.
  - `debounce` (optional, default: `500`): The delay (in milliseconds) before the resize event is processed. This helps to optimize performance by reducing the number of times the callback function is called during resizing. Alternatively, you can set the global `useResizeObserver.setDebounce` function to change the default debounce delay.
- `deps` (optional, default: `[]`): The dependencies to be used in the callback function.

```jsx
useResizeObserver.setDebounce(500)
```

## Return Value

An array containing the `setResizeObserverRef` function and the `resizeObserver` state.

- `setResizeObserverRef` (function): A function to set the ref of the element to observe.
- `entry` (ResizeObserverEntry | (entry: ResizeObserverEntry) => void): The current resize observer entry.

