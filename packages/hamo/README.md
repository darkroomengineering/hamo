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
- **Zero dependencies** — ships dual ESM + CJS with `"use client"` only where needed; works in Next.js, React Router, TanStack Start, Vite, and any bundler
- **SSR & RSC safe** — every browser hook is effect-guarded, so there are no hydration mismatches, and `useObjectFit` runs in Server Components

## Installation

```bash
npm i hamo
```

Requires **React 18 or 19** and **Lenis ≥ 1.3** (declared as peer dependencies). hamo ships **zero runtime dependencies** of its own.

## Hooks

[`useRect`](./src/use-rect/README.md) – tracks element position within the page

[`useWindowSize`](./src/use-window-size/README.md) – tracks window dimensions

[`useResizeObserver`](./src/use-resize-observer/README.md) – observes element dimensions using ResizeObserver

[`useLazyState`](./src/use-lazy-state/README.md) – runs a callback when the state changes without re-rendering the component

[`useDebouncedCallback/useDebouncedEffect/useDebouncedState`](./src/use-debounce/README.md) – debounces a callback, effect, or state

[`useObjectFit`](./src/use-object-fit/README.md) – calculates the x and y scale of an object based on its parent width and height

[`useIntersectionObserver`](./src/use-intersection-observer/README.md) – observes element intersection with the viewport

## License

MIT © [darkroom.engineering](https://github.com/darkroomengineering)

## Shoutout

Thank you to [Luca Gesmundo](https://github.com/lucagez) for having transfered us the npm package name 🙏.