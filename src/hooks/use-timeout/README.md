# useTimeout

A React hook that allows you to run a callback after a specified delay. This hook is useful when you want to delay the execution of a callback.

## Usage

```jsx
import { useTimeout } from 'hamo'

function MyComponent() {
  useTimeout(() => {
    console.log('Hello, world!')
  }, 1000)
}
```

## Parameters

- `callback` (`Function`): A function that is called after the delay.
- `delay` (`Number`): The delay in milliseconds.
- `deps` (`Array`, optional): An array of dependencies.
