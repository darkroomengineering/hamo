[![HAMO](https://assets.darkroom.engineering/hamo/header.png)](https://github.com/darkroomengineering/hamo)

<!-- <p align="center">
  <a aria-label="Vercel logo" href="https://vercel.com">
    <img src="https://badgen.net/badge/icon/Next?icon=zeit&label&color=black&labelColor=black">
  </a>
  <br/>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/swr">
    <img alt="" src="https://badgen.net/npm/v/swr?color=black&labelColor=black">
  </a>
  <a aria-label="Package size" href="https://bundlephobia.com/result?p=swr">
    <img alt="" src="https://badgen.net/bundlephobia/minzip/swr?color=black&labelColor=black">
  </a>
  <a aria-label="License" href="https://github.com/vercel/swr/blob/main/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/swr?color=black&labelColor=black">
  </a>
</p> -->

## Introduction

`hāmō` means hook in Latin, this package is a collection of custom React hooks.

## Setup

```bash
$ npm i @darkroom.engineering/hamo
```

## Hooks

[`useRect`](./packages/react/src/use-rect/README.md) – tracks element position within the page

[`useWindowSize`](./packages/react/src/use-window-size/README.md) – tracks window dimensions

[`useResizeObserver`](./packages/react/src/use-resize-observer/README.md) – observes element dimensions using ResizeObserver

[`useLazyState`](./packages/react/src/use-lazy-state/README.md) – runs a callback when the state changes without re-rendering the component

[`useTimeout`](./packages/react/src/use-timeout/README.md) – runs a callback after a specified delay

[`useObjectFit`](./packages/react/src/use-object-fit/README.md) – calculates the x and y scale of an object based on its parent width and height

<!-- `useOutsideClickEvent` – trigger a callback when user clicks outside of a reference node.

`useDebug` – returns true if #debug, ?debug or /\_debug is present in the url.

`useDocumentReadyState` – returns `document.readyState`.

`useInterval` – run a callback every x milliseconds.

`useIsClient` – returns true if window is defined.

`useIsTouchDevice` – returns true if client is using a touch-capable device.

`useIntersectionObserver` – returns a setRef and the `intersection` object, which will have the method `.intersecting` as true or false depending on the configurations passed to the hook.

`useMediaQuery` – css-like media query support in Javascript.

`useSlots` – brings vue `slots` to react -->

## Authors

This set of hooks is curated and maintained by the darkroom.engineering team:

- Clément Roche ([@clementroche\_](https://twitter.com/clementroche_)) – [darkroom.engineering](https://darkroom.engineering)
- Guido Fier ([@uido15](https://twitter.com/uido15)) – [darkroom.engineering](https://darkroom.engineering)
- Leandro Soengas ([@lsoengas](https://twitter.com/lsoengas)) - [darkroom.engineering](https://darkroom.engineering)
- Franco Arza ([@arzafran](https://twitter.com/arzafran)) - [darkroom.engineering](https://darkroom.engineering)

<br/>

## License

[The MIT License.](https://opensource.org/licenses/MIT)
