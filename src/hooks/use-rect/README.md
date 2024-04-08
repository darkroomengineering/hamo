# useRect

The `useRect` hook is a custom React hook that provides functionality for measuring the dimensions and position of a DOM element. It can be particularly useful for scenarios where you need to dynamically adjust layout or styles based on the size or position of a DOM element.

## Usage

To use the `useRect` hook, import it into your React component and invoke it to obtain the necessary measurements and position information of a DOM element.

```jsx
import { useState } from 'react'
import { useRect } from '@studio-freight/hamo'

function MyComponent() {
  const [setRef, rect] = useRect({
    // Optional configuration options
    ignoreTransform: false,
    ignoreSticky: true,
    debounce: 500,
    lazy: false,
    callback: (rect) => {
      // Callback function to handle measurement updates
      console.log(rect)
    },
  })

  return (
    <div>
      <div ref={setRef}>{/* Your content */}</div>
      <p>Element width: {rect?.width}</p>
      <p>Element height: {rect?.height}</p>
    </div>
  )
}
```

## Parameters

The `useRect` hook accepts an options object with the following optional parameters:

- `ignoreTransform`: (boolean) If `true`, ignores CSS transformations applied to the element and its parents. It's useful for animations such as parallax. Default is `false`.
- `ignoreSticky`: (boolean) If `true`, ignores sticky positioning of the element and its parents. See the difference [with](https://jsfiddle.net/Lk74do8u/) and [without](https://jsfiddle.net/3962n0ov/). Default is `true`.
- `debounce`: (number) Delay in milliseconds for debouncing measurement updates. Default is `500`.
- `lazy`: (boolean) If `true`, doesn't trigger state update and return a getter instead. Default is `false`.
- `callback`: (function) A callback function to be invoked whenever the dimensions or position of the element change.

## Return Value

The `useRect` hook returns an array containing the following elements:

1. `setRef`: A function that should be passed as the `ref` prop to the target DOM element.
2. `rect`: An object representing the current dimensions and position of the element. if `lazy` is `true`, `rect` is a function that returns the current dimensions and position of the element. The object has the following properties:
   - `element`: The DOM element being measured.
   - `width`: The width of the element.
   - `height`: The height of the element.
   - `top`, `y`: The distance from the top of the document to the top of the element.
   - `left`, `x`: The distance from the left of the document to the left of the element.
   - `right`: The distance from the left of the document to the right of the element.
   - `bottom`: The distance from the top of the document to the bottom of the element.
3. `setWrapperRef`: A function to set a reference to the wrapper element. Default wrapper element is `document.body`. Any time the wrapper element is resized, the dimensions and position of the target element are recalculated.

## Additional Functionality

The `useRect` hook provides additional functionality through its `resize` method, which can be used to trigger manual resizing when needed.

```javascript
useRect.resize()
```

This method emits a 'resize' event, triggering recalculation of element dimensions and positions.

## Example

### Basic

```jsx
import { useRect } from '@studio-freight/hamo'

function MyComponent() {
  const [setRectRef, rect] = useRect()

  return (
    <div>
      <div ref={setRectRef}>{/* Your content */}</div>
      <p>Element width: {rect?.width}</p>
      <p>Element height: {rect?.height}</p>
    </div>
  )
}
```

### Lazy

```jsx
import { useRect } from '@studio-freight/hamo'

function MyComponent() {
  const [setRectRef, getRect] = useRect({
    lazy: true,
    callback: (rect) => {
      console.log(rect)
    },
  })

  useEffect(() => {
    const rect = getRect()
    console.log(rect)
  }, [getRect])

  return (
    <div>
      <div ref={setRectRef}>{/* Your content */}</div>
    </div>
  )
}
```

### Custom Wrapper Element

```jsx
import { useRect } from '@studio-freight/hamo'

function MyComponent() {
  const [setRectRef, rect, setWrapperRef] = useRect()

  return (
    <div ref={setWrapperRef}>
      <div ref={setRectRef}>{/* Your content */}</div>
      <p>Element width: {rect.width}</p>
      <p>Element height: {rect.height}</p>
    </div>
  )
}
```
