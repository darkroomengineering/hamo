# useWindowSize

A React hook that listens to changes in the window size and provides the current width and height.

## Usage

```jsx
import { useEffect } from 'react'
import { useWindowSize } from '@darkroom.engineering/hamo'

function App() {
  const { width, height, dpr } = useWindowSize()

  return (
    <div>
      <p>Window width: {width}</p>
      <p>Window height: {height}</p>
      <p>Device pixel ratio: {dpr}</p>
    </div>
  )
}
```

## Parameters

- `debounceDelay` (optional, default: 500): The delay (in milliseconds) before the window resize event is processed. This helps to optimize performance by reducing the number of times the callback function is called during resizing. Alternatively, you can set the global `useWindowSize.setDebounceDelay` function to change the default debounce delay.

```jsx
import { useWindowSize } from '@darkroom.engineering/hamo'

useWindowSize.setDebounceDelay(500)
```

## Return Value

An object containing the current window width and height:

- `width` (number): The current width of the window.
- `height` (number): The current height of the window.
- `dpr` (number): The current device pixel ratio of the window.
