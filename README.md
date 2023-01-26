[![HAMO](https://assets.studiofreight.com/hamo/header.png)](https://github.com/studio-freight/hamo)

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

<br/>

## Setup

```bash
$ npm i @studio-freight/hamo
```

or use whatever package manager you like the most

<br/>

## Features

This toolkit is composed of:

`useClickOutsideEvent` – trigger a callback when user clicks outside of a reference node.

`useDebug` – returns true if #debug is present in the url.

`useDocumentReadyState` – returns true if document is ready.

`useEventBus, { dipatch }` – creates a global event bus.

`useFrame` – use `@studio-freight/tempus` animation frame.

`useInterval` – create and dispose intervals.

`useIsClient` – returns true if window is defined.

`useIsTouchDevice` – returns true if client is using a touch-capable device.

`useIsVisible` – returns true if a reference node is in the viewport.

`useLayoutEffect` – runs react's `useLayoutEffect` if in browser, if not, runs a plain `useEffect` instead

`useMediaQuery` – css-like media query support in Javascript.

`useRect` – getboundingclientrect with scrollY sauce if using our [lenis](https://github.com/studio-freight/lenis) smooth scroll

`useSlots` – brings vue `slots` to react

<br/>

## Authors

This set of hooks is curated and maintained by the Studio Freight Darkroom team:

- Clement Roche ([@clementroche\_](https://twitter.com/clementroche_)) – [Studio Freight](https://studiofreight.com)
- Guido Fier ([@uido15](https://twitter.com/uido15)) – [Studio Freight](https://studiofreight.com)
- Leandro Soengas ([@lsoengas](https://twitter.com/lsoengas)) - [Studio Freight](https://studiofreight.com)
- Franco Arza ([@arzafran](https://twitter.com/arzafran)) - [Studio Freight](https://studiofreight.com)

<br/>

## License

[The MIT License.](https://opensource.org/licenses/MIT)
