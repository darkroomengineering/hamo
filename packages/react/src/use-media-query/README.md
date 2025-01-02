# useMediaQuery

A React hook that detects whether a media query is `true` or `false`.

## Usage

```jsx
import { useEffect } from 'react'
import { useMediaQuery } from '@darkroom.engineering/hamo'

function App() {
  const isMobile = useMediaQuery('(min-width: 800px)')

  return (
    <div>
      isMobile: {isMobile ? 'true' : 'false'}
    </div>
  )
}
```

## Parameters

- `query` (string): The media query to test against.

## Return Value

- `isMatch` (boolean): Whether the media query is true or false.
