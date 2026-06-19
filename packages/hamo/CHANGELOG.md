# Changelog

## 1.0.0

First stable release.

### Added

- **`useScrollTrigger`** — scroll-progress tracking with GSAP ScrollTrigger-style
  position syntax (`"bottom bottom"`, `"top center"`, pixel offsets). Integrates
  with [Lenis](https://github.com/darkroomengineering/lenis) when present and
  falls back to native scroll otherwise. A debug overlay ships behind the
  `hamo/scroll-trigger/debugger` subpath.
- **`useTransform` / `TransformProvider`** — context-based transform accumulation
  (additive translate/rotate, multiplicative scale) so children can compensate
  for parent transforms such as parallax offsets.
- **`useEffectEvent`** — a public, SSR-safe ponyfill of React's experimental
  `useEffectEvent` (stable identity, always calls the latest callback). The
  internal hooks now route their stable-callback pattern through it.
- **ESM-only** build with correct `types` resolution (verified with `publint`
  and `@arethetypeswrong/cli`). The target stack (Next.js, React Router,
  TanStack, Vite) is ESM-native; CJS consumers can load it via dynamic
  `import()`.
- Test suite (`bun test` + `@testing-library/react` + `happy-dom`) covering
  every hook: render smoke tests, SSR (`renderToString`) safety, and a
  debounce-cancel-on-unmount leak regression.
- CI: typecheck + lint + build on every PR, and a test matrix across React 18
  and 19. Publishing runs the full gate and publishes with npm provenance.

### Changed

- **Zero runtime dependencies** — the internal resize and scroll-trigger emitters
  are inlined; the `nanoevents` dependency is gone.
- Per-file `"use client"` directives (via `tsdown` unbundle) instead of a single
  bundle banner, so `useObjectFit` stays usable in Server Components.
- Minification and polyfilling are delegated to the consuming framework; the
  package ships modern, unminified, sourcemapped output.
- Toolchain consolidated onto **Biome** (formatter + linter, including
  rules-of-hooks). The unused ESLint config was removed.
- The library now lives in `packages/hamo/` within a Bun-workspace monorepo;
  the `playground/` is a sibling workspace that links it via `workspace:*`.

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
- `lenis >= 1.3.0` — **optional**, only needed by `useScrollTrigger` (the hook
  falls back to native scroll without it).
</content>
</invoke>
