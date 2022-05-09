# @lopatnov/rollup-plugin-uglify [![Twitter](https://img.shields.io/twitter/url?url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Frollup-plugin-uglify)](https://twitter.com/intent/tweet?text=I%20want%20to%20share%20TypeScript%20library:&url=https://www.npmjs.com/package/@lopatnov/rollup-plugin-uglify)

[![npm](https://img.shields.io/npm/dt/@lopatnov/rollup-plugin-uglify)](https://www.npmjs.com/package/@lopatnov/rollup-plugin-uglify)
[![NPM version](https://badge.fury.io/js/%40lopatnov%2Frollup-plugin-uglify.svg)](https://www.npmjs.com/package/@lopatnov/rollup-plugin-uglify)
[![License](https://img.shields.io/github/license/lopatnov/rollup-plugin-uglify)](https://github.com/lopatnov/rollup-plugin-uglify/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/lopatnov/rollup-plugin-uglify)](https://github.com/lopatnov/rollup-plugin-uglify/issues)
[![GitHub forks](https://img.shields.io/github/forks/lopatnov/rollup-plugin-uglify)](https://github.com/lopatnov/rollup-plugin-uglify/network)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/rollup-plugin-uglify)](https://github.com/lopatnov/rollup-plugin-uglify/stargazers)
![GitHub top language](https://img.shields.io/github/languages/top/lopatnov/rollup-plugin-uglify)

[![Patreon](https://img.shields.io/badge/Donate-Patreon-informational)](https://www.patreon.com/lopatnov)
[![sobe.ru](https://img.shields.io/static/v1?label=sobe.ru&message=%D0%91%D0%BB%D0%B0%D0%B3%D0%BE%D0%B4%D0%B0%D1%80%D0%BD%D0%BE%D1%81%D1%82%D1%8C&color=yellow&logo=data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAArlBMVEUAAAD//////////////////////////////////////////////////////////////////PP/3l7/9c//0yb/zAD/6ZP/zQf/++7/3FD/88X/0h7//v7/5oX/zATUqQDktgD/5HjQpgAFBACQcwD/zw/fsgCOcQD6yADZrQD2xAD8yQDnuADxwADcsADbrwDpugD3xQD5xwDjtQDywQD+ywD9ygDvvwD7yAD/1jRaObVGAAAAEHRSTlMAA3zg707pEJP8MMUBYN5fiwXJMQAAAAFiS0dEAf8CLd4AAAAHdElNRQflBgMAAxO4O2jCAAAAuElEQVQoz42S1w7CMAxFS8ueYZgNLZuyRynw/z9GdtxIkbgPceQT6Tq2vZwfEKx8wRPyiaViSYDABqQsAMq0OzxUqhbo9kBcavUM6A9AAtJAYDgC0ID7i+t4AghwfxanszlAGBnA/Flc0MfL1doA5s/ChoLtbg8QI392gpIBzf/AwYAWAsdTrIE05/nz5Xq7S6DKpenHM0pe+o/qg5Am74/0ybTkm+q6wG4iltV2LTko52idy+Banx9RYiS6Vrsc3AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNi0wM1QwMDowMzoxOCswMDowMLvSSCkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDYtMDNUMDA6MDM6MTgrMDA6MDDKj/CVAAAAAElFTkSuQmCC)](https://sobe.ru/na/tech_knigi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-lopatnov-informational?style=social&logo=linkedin)](https://www.linkedin.com/in/lopatnov/)

[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@lopatnov/rollup-plugin-uglify)](https://www.npmjs.com/package/@lopatnov/rollup-plugin-uglify?activeTab=dependencies)

A rollup plugin to minify javascript

## Requirements

Install rollup and terser first.

```shell
npm install rollup --save-dev
npm install terser --save-dev
```

## Install

[![https://nodei.co/npm/@lopatnov/rollup-plugin-uglify.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/@lopatnov/rollup-plugin-uglify.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@lopatnov/rollup-plugin-uglify)

```shell
npm install @lopatnov/rollup-plugin-uglify --save-dev
```

### Import package to the project

TypeScript

```typescript
import uglify from "@lopatnov/rollup-plugin-uglify";
```

JavaScript

```javascript
var uglify = require("@lopatnov/rollup-plugin-uglify");
```

### How to use plugin

File rollup.config.ts

```typescript
export default {
  //...
  plugins: [
    //...
    uglify()
  ]
};
```

#### with options

```typescript
export default {
  //...
  plugins: [
    //...
    uglify({
      //options: IUglifyOptions
    })
  ]
};
```

#### Options

`uglify` function has optional argument `options: IUglifyOptions`.

`IUglifyOptions` is an interface, that extends [`MinifyOptions`][minify-options] of `terser` package.

`IUglifyOptions` contains:

- `include?: string | RegExp`
- `exclude?: string | RegExp`

A valid minimatch pattern, or array of patterns to include / exclude files. If `include` is omitted or has zero length, filter will return true by default. Otherwise, an ID must match one or more of the minimatch patterns, and must not match any of the `exclude` patterns.

## Rights and Agreements

License [Apache-2.0][license]

Copyright 2019-2021 Oleksandr Lopatnov

[minify-options]: https://terser.org/docs/api-reference#minify-options-structure
[license]: https://github.com/lopatnov/rollup-plugin-uglify/blob/master/LICENSE
