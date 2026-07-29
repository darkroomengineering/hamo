[![HAMO](https://assets.darkroom.engineering/hamo/banner.gif)](https://github.com/darkroomengineering/hamo)

## Introduction

`hāmō` means hook in Latin, this package is a collection of custom performance-oriented React hooks.

## Features

- **Render-safe hooks** — a small, tree-shakeable set of performance-oriented React hooks
- **Measurement hooks** — useRect, useWindowSize, and useResizeObserver track element and viewport size without thrash
- **useIntersectionObserver** — fire when elements enter or leave the viewport
- **useLazyState** — update a value through a callback without triggering a re-render
- **Debounce hooks** — useDebouncedCallback, Effect, and State debounce from one primitive
- **useObjectFit** — compute object-fit scale from a parent's dimensions

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

[`useMediaQuery`](./packages/react/src/use-media-query/README.md) – detects whether a media query matches

[`useEffectEvent`](./packages/react/src/use-effect-event/README.md) – polyfill for React's experimental useEffectEvent, returns a stable function that always calls the latest callback

[`useScrollTrigger`](./packages/react/src/use-scroll-trigger/README.md) – high-performance scroll progress tracker

[`useTransform`](./packages/react/src/use-transform/README.md) – context-based transform accumulation across the component tree

## License

MIT © [darkroom.engineering](https://github.com/darkroomengineering)

## Shoutout

Thank you to [Luca Gesmundo](https://github.com/lucagez) for having transfered us the npm package name 🙏.