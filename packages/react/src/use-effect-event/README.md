# useEffectEvent

A polyfill for React's experimental [`useEffectEvent`](https://react.dev/reference/react/useEffectEvent) hook. Returns a stable function reference that always calls the latest version of your callback, without needing to be listed in effect dependency arrays.

React's `useEffectEvent` is still experimental and not available in any stable release. This implementation provides the same core behavior for React 17+ projects.

## Usage

```jsx
import { useEffectEvent } from 'hamo'

function Chat({ url, onMessage }) {
  const handleMessage = useEffectEvent(onMessage)

  useEffect(() => {
    const ws = new WebSocket(url)
    ws.addEventListener('message', handleMessage)

    return () => ws.close()
  }, [url]) // handleMessage doesn't need to be in deps
}
```

## Parameters

- `callback`: The function to wrap. Can accept any arguments and return any value.

## Return Value

A stable function with the same signature as your callback. The identity never changes across renders, but calling it always invokes the latest `callback` from the most recent render.

## How It Works

The hook stores your callback in a ref (updated every render) and returns a memoized wrapper created once via lazy `useState`. The wrapper delegates to the ref on each call, so:

- The returned function has a **stable identity** (same reference every render)
- It always reads the **latest props and state** at call time
- It can safely be omitted from effect dependency arrays

## Differences from React's Experimental Version

| | React `useEffectEvent` | hamo `useEffectEvent` |
|---|---|---|
| Availability | Experimental, not in stable React | React 17+ |
| Identity | Intentionally unstable (changes every render) | Stable (same reference every render) |
| Callable from | Effects and other Effect Events only | Anywhere (effects, event handlers, callbacks) |
| Lint enforcement | ESLint plugin enforces constraints | No restrictions |

The stable identity in hamo's version is a practical trade-off — it makes the hook more versatile (usable in event handlers, passed as props) while still solving the core problem of reading latest values without re-triggering effects.

## Examples

### Interval with Latest State

```jsx
import { useEffect, useState } from 'react'
import { useEffectEvent } from 'hamo'

function Counter() {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState(1)

  const onTick = useEffectEvent(() => {
    setCount((c) => c + step) // always reads latest step
  })

  useEffect(() => {
    const id = setInterval(onTick, 1000)
    return () => clearInterval(id)
  }, []) // no need to restart interval when step changes

  return (
    <div>
      <p>{count}</p>
      <input
        type="number"
        value={step}
        onChange={(e) => setStep(Number(e.target.value))}
      />
    </div>
  )
}
```

### Effect Without Unnecessary Re-runs

```jsx
import { useEffect } from 'react'
import { useEffectEvent } from 'hamo'

function Logger({ data, onLog }) {
  const log = useEffectEvent(onLog)

  useEffect(() => {
    log(data) // always calls latest onLog
  }, [data]) // effect only re-runs when data changes, not when onLog changes
}
```

### Scroll Listener with Latest Callback

```jsx
import { useEffect } from 'react'
import { useEffectEvent } from 'hamo'

function useScroll(callback) {
  const handler = useEffectEvent(callback)

  useEffect(() => {
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, []) // listener attached once, always calls latest callback
}
```
