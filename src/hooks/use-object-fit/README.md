# useObjectFit

A React hook that calculates the x and y scale of an object based on its parent width and height. It can be particularly useful when you want to display an image or video in a container with a specific aspect ratio using WebGL or canvas.

## Usage

Imagine you wanna display a 16/9 aspect ratio image that covers a 1/2 aspect ratio container.

```jsx
import { useObjectFit } from 'hamo'

function MyComponent() {
  /* parentWidth, parentHeight, childWidth, childHeight, objectFit */

  const [x, y] = useObjectFit(1, 2, 16, 9, 'cover')
}
```

## Parameters

- `parentWidth` (number, optional): The width of the parent container. Default is `1`.
- `parentHeight` (number, optional): The height of the parent container. Default is `1`.
- `childWidth` (number, optional): The width of the child element. Default is `1`.
- `childHeight` (number, optional): The height of the child element. Default is `1`.
- `objectFit` (string, optional): The object-fit property of the child element. Default is `cover`.

## Return Value

An array containing the width and height of the child element.
