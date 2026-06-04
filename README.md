[![HAMO](https://assets.darkroom.engineering/hamo/banner.gif)](https://github.com/darkroomengineering/hamo)

## Introduction

`hāmō` means hook in Latin, this package is a collection of custom performance-oriented React hooks.

## Features

- A collection of performance-oriented, tree-shakeable React hooks
- useRect / useWindowSize / useResizeObserver, to track element and viewport dimensions
- useIntersectionObserver, to observe viewport intersection
- useLazyState, to update values without triggering a re-render
- useDebouncedCallback / useDebouncedEffect / useDebouncedState, to debounce callbacks, effects, and state
- useObjectFit, to compute object-fit scale from parent dimensions

## Installation

```bash
$ npm i hamo
```

## Hooks

[`useRect`](./packages/react/src/use-rect/README.md) – tracks element position within the page

[`useWindowSize`](./packages/react/src/use-window-size/README.md) – tracks window dimensions

[`useResizeObserver`](./packages/react/src/use-resize-observer/README.md) – observes element dimensions using ResizeObserver

[`useLazyState`](./packages/react/src/use-lazy-state/README.md) – runs a callback when the state changes without re-rendering the component

[`useDebouncedCallback/useDebouncedEffect/useDebouncedState`](./packages/react/src/use-debounce/README.md) – debounces a callback, effect, or state

[`useObjectFit`](./packages/react/src/use-object-fit/README.md) – calculates the x and y scale of an object based on its parent width and height

[`useIntersectionObserver`](./packages/react/src/use-intersection-observer/README.md) – observes element intersection with the viewport

## License

MIT © [darkroom.engineering](https://github.com/darkroomengineering)

## Shoutout

Thank you to [Luca Gesmundo](https://github.com/lucagez) for having transfered us the npm package name 🙏.