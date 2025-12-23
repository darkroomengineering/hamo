# useDebouncedState

A hook that allows you to debounce a state.

## Usage

```jsx
import { useDebouncedState } from 'hamo'

function App() {
  const [count, setCount] = useDebouncedState(0, 1000)

  console.log('count', count)

  return (
    <div>
      <div>count: {count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  )
}
```

## Parameters

- `initialValue`: The initial value of the state.
- `delay`: The delay (in milliseconds) before the state is updated.

## Return Value

- `[debouncedState, setState]`: An array containing the debounced state and the setState function.


# useDebouncedEffect

A hook that allows you to debounce an effect.

## Usage

```jsx
import { useDebouncedEffect } from 'hamo'

function App() {
  const [count, setCount] = useState(0)

  useDebouncedEffect(() => {
    console.log('debounced effect', count)
  }, 1000, [count])

  return (
    <div>
      <div>count: {count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  )
}
```

## Parameters

- `callback`: The callback function to be executed after the delay.
- `delay`: The delay (in milliseconds) before the callback function is executed.
- `deps`: The dependencies array for the hook.



# useDebouncedCallback

A hook that allows you to debounce a callback.

## Usage

```jsx
import { useDebouncedCallback } from 'hamo'

function App() {
  const debouncedCallback = useDebouncedCallback(() => {
    console.log('debounced callback')
  }, 1000)

  return (
    <div>
      <div>count: {count}</div>
      <button onClick={debouncedCallback}>click</button>
    </div>
  )
}
```

## Parameters

- `callback`: The callback function to be executed after the delay.
- `delay`: The delay (in milliseconds) before the callback function is executed.
- `deps`: The dependencies array for the hook.