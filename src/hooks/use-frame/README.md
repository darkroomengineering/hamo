# useFrame

This hook allows you to run a callback every frame based on [@darkroom.engineering/tempus](https://twitter.com/home).

## Parameters

- `callback` (`Function`): A function that is called every frame.
- `priority` (`Number`, optional): A number that determines the order in which the callback is called. Defaults to `0`.

## Example

```jsx
import { useFrame } from '@darkroom.engineering/hamo'

function MyComponent() {
  useFrame((time, deltaTime) => {
    console.log(`time elapsed: ${time}`, `time elapsed since last frame: ${deltaTime}`)
  })
}
```
