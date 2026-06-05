# Changelog

## 1.0.0

First stable release.

### Added

- Dual **ESM + CJS** build with correct `types` resolution for `import` and
  `require` (verified with `publint` and `@arethetypeswrong/cli`).
- Test suite (`bun test` + `@testing-library/react` + `happy-dom`) covering
  every hook: render smoke tests, SSR (`renderToString`) safety, and a
  debounce-cancel-on-unmount leak regression.
- CI: typecheck + lint + build on every PR, and a test matrix across React 18
  and 19. Publishing runs the full gate and publishes with npm provenance.

### Changed

- **Zero runtime dependencies** — the internal resize emitter no longer depends
  on `nanoevents`.
- Per-file `"use client"` directives (via `tsdown` unbundle) instead of a single
  bundle banner, so `useObjectFit` stays usable in Server Components.
- Minification and polyfilling are delegated to the consuming framework; the
  package ships modern, unminified, sourcemapped output.
- Toolchain consolidated onto **Biome** (formatter + linter, including
  rules-of-hooks). The unused ESLint config was removed.
- Source collapsed from a `packages/react` workspace into a single `src/` tree.

### Fixed

- `useRef<T>()` calls now pass an initial value — the library type-checks
  cleanly against `@types/react` 19.
- `useIntersectionObserver` now has a correct `lazy` conditional return type
  (no more `as IntersectionObserverEntry` cast), a stable callback ref, and
  accepts `number | number[]` thresholds.
- `useLazyState` now reports the real `previousValue` (it was always
  `undefined`).
- `useDebouncedCallback` and `useResizeObserver` cancel pending timers on
  unmount, preventing callbacks from firing after teardown.

### Removed

- `react-dom` peer dependency (it was never imported).

### Peer dependencies

- `react >= 18`.
