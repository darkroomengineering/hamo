# useTimeout

A hook that allows you to set a timeout.

## Usage

```jsx
import { useTimeout } from '@darkroom.engineering/hamo'

function App() {
  useTimeout(() => {
    console.log('timeout')
  }, 5000)
}
```

## Parameters

- `callback`: The callback function to be executed after the delay.
- `delay`: The delay (in milliseconds) before the callback function is executed.
- `deps`: The dependencies array for the hook.

