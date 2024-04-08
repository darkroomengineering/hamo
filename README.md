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

Hamo means hook, you do the math

🚧 This package is not stable, API might change at any time 🚧

<br/>

## Setup

```bash
$ npm i @studio-freight/hamo
```

or use whatever package manager you like the most

<br/>

## Features

This toolkit is composed of:

`useRect` – [See documentation](https://github.com/darkroomengineering/hamo/blob/main/src/hooks/use-rect/README.md)

`useOutsideClickEvent` – trigger a callback when user clicks outside of a reference node.

`useDebug` – returns true if #debug, ?debug or /\_debug is present in the url.

`useDocumentReadyState` – returns `document.readyState`.

`useFrame` – use `@studio-freight/tempus` animation frame.

`useInterval` – run a callback every x milliseconds.

`useIsClient` – returns true if window is defined.

`useIsTouchDevice` – returns true if client is using a touch-capable device.

`useIntersectionObserver` – returns a setRef and the `intersection` object, which will have the method `.intersecting` as true or false depending on the configurations passed to the hook.

`useMediaQuery` – css-like media query support in Javascript.

`useSlots` – brings vue `slots` to react

`useResizeObserver` – observe elements dimensions using ResizeObserver

`useWindowSize` – listens to window size and returns width and height.

<br/>

## Authors

This set of hooks is curated and maintained by the darkroom.engineering team:

- Clément Roche ([@clementroche\_](https://twitter.com/clementroche_)) – [darkroom.engineering](https://darkroom.engineering)
- Guido Fier ([@uido15](https://twitter.com/uido15)) – [darkroom.engineering](https://darkroom.engineering)
- Leandro Soengas ([@lsoengas](https://twitter.com/lsoengas)) - [darkroom.engineering](https://darkroom.engineering)
- Franco Arza ([@arzafran](https://twitter.com/arzafran)) - [darkroom.engineering](https://darkroom.engineering)

<br/>

## License

[The MIT License.](https://opensource.org/licenses/MIT)
