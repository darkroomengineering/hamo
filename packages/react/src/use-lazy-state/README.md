# useLazyState

A React hook that allows you to trigger a callback when the state changes without updating the component.

## Usage

```jsx
import { useLazyState } from '@darkroom.engineering/hamo'

function App() {
  const [setState, getState] = useLazyState(0, (value, previousValue) => {
    console.log(value, previousValue)
  })
}
```

## Parameters

- `initialValue` (any): The initial value of the state.
- `callback` (function): The callback function to be called when the state changes.
- `deps` (array): The dependencies to be used in the callback function.

## Return Value

- `setState` (function): The function to update the state.
- `getState` (function): The function to get the current value of the state.