# useRect

The `useRect` hook is a custom React hook that provides functionality for measuring the dimensions and position of a DOM element. It can be particularly useful for scenarios where you need to dynamically adjust layout or styles based on the size or position of a DOM element.

## Usage

```jsx
import { useRect } from '@darkroom.engineering/hamo'

function App() {
  // Basic usage
  const [setRectRef, rect] = useRect()
  console.log(rect)

  // Lazy usage
  const [setRectRef, getRect] = useRect({
    lazy: true,
    callback: (rect) => {
      console.log(rect)
    },
  })

  return (
    <div ref={setRectRef} />
  )
}
```

## Parameters

The `useRect` hook accepts an options object with the following optional parameters:

- `parameters`: (object) An object containing the following optional parameters:
  - `ignoreTransform`: (boolean, default: `false`) If `true`, ignores CSS transform applied to the element and its parents. It's useful for animations such as parallax.
  - `ignoreSticky`: (boolean, default: `true`) If `true`, ignores sticky positioning of the element and its parents. See the difference [with](https://jsfiddle.net/Lk74do8u/) and [without](https://jsfiddle.net/3962n0ov/).
  - `debounce`: (number, default: `500`) Delay in milliseconds for debouncing measurement updates. Alternatively, you can set the global `useResizeObserver.setDebounce` function to change the default debounce delay.
  - `lazy`: (boolean, default: `false`) If `true`, doesn't trigger state update and return a getter instead.
  - `callback`: (function) A callback function to be invoked whenever the dimensions or position of the element change.
- `deps`: (array) An array of dependencies.

```jsx
useRect.setDebounce(500)
```

## Return Value

The `useRect` hook returns an array containing the following elements:

1. `setRef`: A function that should be passed as the `ref` prop to the target DOM element.
2. `rect`: An object representing the current dimensions and position of the element. if `lazy` is `true`, `rect` is a function that returns the current dimensions and position of the element. The object has the following properties:
   - `element`: The DOM element being measured.
   - `resize`: A function to trigger manual resizing when needed.
   - `width`: The width of the element.
   - `height`: The height of the element.
   - `top`, `y`: The distance from the top of the document to the top of the element.
   - `left`, `x`: The distance from the left of the document to the left of the element.
   - `right`: The distance from the left of the document to the right of the element.
   - `bottom`: The distance from the top of the document to the bottom of the element.
3. `setWrapperRef`: A function to set a reference to the wrapper element. Default wrapper element is `document.body`. Any time the wrapper element is resized, the dimensions and position of the target element are recalculated.

## Additional Functionality

### Programmatic resize

The `useRect` hook provides additional functionality through its `resize` method, which can be used to trigger manual resizing when needed for all useRect instances.

```javascript
useRect.resize()
```

### Custom Wrapper Element

```jsx
import { useRect } from '@darkroom.engineering/hamo'

function App() {
  const [setRectRef, rect, setWrapperRef] = useRect()
  console.log(rect)

  return (
    <div ref={setWrapperRef} />
  )
}
```
