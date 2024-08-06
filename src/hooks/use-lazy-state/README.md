# useLazyState

A React hook that allows you to run a callback when the state changes. This hook is useful when the state changes very often so you avoid re-rendering the component unnecessarily.

## Usage

```jsx
import { useLazyState } from '@darkroom.engineering/hamo'

function MyComponent() {
  const [get, set] = useLazyState(0, (value, previousValue) => {
    console.log(`value: ${value}, previousValue: ${previousValue}`)
  })

  return (
    <div>
      {/* value doesn't get updated since no react state has changed */}
      <p>Value: {get()}</p>
      <button onClick={() => set((value) => value + 1)}>Increment</button>
    </div>
  )
}
```

## Parameters

- `initialValue` (`any`): The initial value of the state.
- `callback` (`Function`): A function that is called when the state changes.

## Return Value

An array containing the following elements:

1. `get`: A function that returns the current state.
2. `set`: A function that sets the state.
