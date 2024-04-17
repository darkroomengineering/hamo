# useWindowSize

A React hook that listens to changes in the window size and provides the current width and height.

## Usage

```jsx
import { useEffect } from 'react'
import { useWindowSize } from '@studio-freight/hamo'

function MyComponent() {
  const { width, height } = useWindowSize()

  return (
    <div>
      <p>Window width: {width}</p>
      <p>Window height: {height}</p>
    </div>
  )
}
```

## Parameters

- `debounceDelay` (optional, default: 500): The delay (in milliseconds) before the window resize event is processed. This helps to optimize performance by reducing the number of times the callback function is called during resizing.

## Return Value

An object containing the current window width and height:

- `width` (number): The current width of the window.
- `height` (number): The current height of the window.
