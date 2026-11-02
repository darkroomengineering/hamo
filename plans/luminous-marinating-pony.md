# hamo v1 hardening

## Context

`hamo` (currently `1.0.0-dev.10`) is a small collection of performance-oriented React
hooks. The goal is to ship a real `1.0.0`. The hook *logic* is sound and SSR behaviour
is correct (every browser hook initializes to `undefined` and touches the DOM only in
effects). But v1 is blocked by checks that were never wired up:

- `tsc --noEmit` **fails** (4 type errors — `useRef<T>()` with no initial arg, plus an
  intersection-observer return-type lie).
- No `typecheck` / `lint` / `test` scripts; CI never builds or type-checks before publish.
- The publish workflow is broken (Node 16 EOL; runs `pnpm --frozen-lockfile` on a **bun**
  repo with no pnpm lock; no build step).
- Rules-of-hooks linting is fake: `.eslintrc.json` exists but ESLint isn't installed.
- `packages/react/README.md` is literally Lenis's README (copy-paste leftover).
- Two real timer leaks; a half-implemented `useLazyState` feature; dead imports.

### Guiding decisions (from the maintainer)

| Decision | Choice |
|---|---|
| Scope | **React-only, single package forever** — collapse the monorepo |
| Toolchain | **Biome only** — delete ESLint; no react-doctor dependency |
| Build target | **Delegate minify/polyfill to the consuming framework** — ship modern, unminified |
| Module formats | **Dual ESM + CJS**, root barrel only (no subpath exports), per-file `"use client"` |
| Runtime deps | **Zero** — inline `nanoevents`; drop unused `react-dom` peer |
| Tests | **bun:test + @testing-library/react + happy-dom** (no extra runner dep) |
| React floor | peer `>=18` (test against 18 + 19; hooks use no 18+ API but 17 leaves the matrix) |

---

## Phase 1 — Correctness & type fixes (unblocks `tsc`)

Pattern — `useRef<T>()` → `useRef<T | undefined>(undefined)`:
- `src/use-intersection-observer/index.ts` (`entryRef`)
- `src/use-lazy-state/index.ts` (`prevStateRef`)
- `src/use-resize-observer/index.ts` (`entryRef`)

Other fixes:
- **`use-intersection-observer`** — adopt the `L extends boolean` conditional return type
  (mirror `use-resize-observer`'s signature), removing the `as IntersectionObserverEntry`
  cast. Stabilize `callback` via a `callbackRef` like the sibling observer hooks (today it's
  a stale closure, omitted from deps). Widen `threshold?: number | number[]` and
  `root?: Element | Document | null` while here.
- **`use-lazy-state`** — actually assign `prevStateRef.current` in `set` so the
  `previousValue` callback arg is real (today it's always `undefined`). Replace the
  `@ts-ignore` (line 29) with proper narrowing / `@ts-expect-error`.
- **`use-debounce` → `useDebouncedCallback`** — add an unmount cleanup
  (`useEffect(() => () => timeoutRef.current?.(), [])`) so a pending timer is cancelled on
  unmount. Fix the `useTimeout` JSDoc (it's a debounced effect, not a one-shot timeout).
- **`use-resize-observer` → `observeElement`** — call `debouncedCallback.cancel()` in the
  returned unsubscribe so a pending resize can't fire after unmount. (`useWindowSize` is the
  correct reference — AbortController + `.cancel()`.)
- **`use-object-fit`** — remove the unused `useMemo` import (it's a pure function; that's
  fine and keeps it RSC-safe).
- **`use-rect`** — replace the `@ts-ignore` (line 212) with `@ts-expect-error` or fix the
  updater typing.

## Phase 2 — Zero runtime dependencies

- Replace `src/use-rect/emitter.ts` (`createNanoEvents()`) with a ~15-line internal typed
  emitter exposing the only surface used: `on('resize', fn) => unbind` and `emit('resize')`.
- Remove `nanoevents` from `dependencies`. Result: **0 runtime deps**.

## Phase 3 — Collapse to a single package

- Move `packages/react/src/*` → `src/*`, `packages/react/index.ts` → `src/index.ts`.
- Delete `packages/react/package.json` (name collision) and `packages/react/README.md` (Lenis).
- Root `package.json`: `workspaces: ["playground"]` only; move `react` / `@types/react`
  into root `devDependencies` (pin `@types/react` ^19 so the build type-checks against the
  strict `useRef` signature). `peerDependencies`: `react >=18`, **drop `react-dom`**.
- Per-hook `README.md` files move with their hooks to `src/<hook>/README.md`; fix the root
  README links accordingly.

## Phase 4 — Build (tsdown), delegating to the framework

Rewrite `tsdown.config.ts`:
- `entry: { hamo: 'src/index.ts' }`, `format: ['esm', 'cjs']`, `unbundle: true`,
  `dts: true`, `sourcemap: true`, **no `minify`**, `platform: 'neutral'`,
  `target: 'es2022'`, `exports: true` (let tsdown generate the dual `import`/`require`/`types`
  conditions). Remove the global `banner` — `unbundle` preserves per-file directives instead.
- Add a `"use client"` directive to the top of every hook source file **except**
  `src/use-object-fit/index.ts` (pure → stays server/RSC-safe). The internal `debounce`
  util is not publicly re-exported, so the directive on `use-debounce/index.ts` is harmless.
- Net dist: `hamo.mjs` + `hamo.cjs` + `.d.ts`/`.d.cts`, unminified, sourcemapped, with
  `"use client"` only where required. The app's bundler does tree-shaking/minify/polyfill.

## Phase 5 — One tool: Biome

- Delete `.eslintrc.json`.
- Upgrade `@biomejs/biome` to latest 2.x; run `biome migrate`. Trim `biome.json` to what a
  TS-only lib needs (drop CSS/graphql/storybook/next cruft). Enable `useHookAtTopLevel`
  (rules of hooks) and keep `useExhaustiveDependencies`.
- `package.json` scripts: `typecheck: tsc --noEmit`, `lint: biome check`,
  `format: biome format --write`, `test: bun test`, `prepublishOnly: tsdown`. Keep `build`.

## Phase 6 — Tests (bun:test)

- devDeps: `@testing-library/react`, `happy-dom`. Add `bunfig.toml` with a test `preload`
  that registers happy-dom globally and sets `IS_REACT_ACT_ENVIRONMENT = true`.
- Colocated `src/<hook>/index.test.ts(x)`:
  - **Smoke** — `renderHook` each hook: mounts without throwing, returns expected shape.
  - **SSR** — `react-dom/server` `renderToString` a component per browser hook: no
    `window`/`document` crash; renders the `undefined`-state markup (locks in SSR safety).
  - **Leak regression** — mount → trigger → unmount with a pending debounce → assert the
    callback does **not** fire afterward (covers Phase 1 fixes).
  - **Pure** — `useObjectFit` contain/cover/guard math; `useLazyState` `previousValue`.
- Contingency: if RTL + bun:test + React 19 `act()` friction appears, fall back to Vitest
  (same specs) — but bun:test is the default per the reduce-deps preference.

## Phase 7 — CI, docs, release

- Rewrite `.github/workflows/publish.yml` for bun: `oven-sh/setup-bun`, Node 20,
  `bun install --frozen-lockfile` → `typecheck` → `lint` → `test` → `build` → `npm publish`
  (`--provenance`, `NODE_AUTH_TOKEN`), on `release: created`. Add `.github/workflows/ci.yml`
  running typecheck/lint/test on PRs (matrix React 18 + 19).
- Root `README.md`: note dual ESM+CJS, React `>=18`, zero dependencies; keep the features
  list. Add `CHANGELOG.md` with the `1.0.0` entry.
- Final: `npm version major --no-git-tag-version` → `1.0.0` (drops `-dev`).

---

## Verification

```bash
bun install
bun run typecheck     # 0 errors (validated against @types/react ^19)
bun run lint          # biome clean: rules-of-hooks + exhaustive-deps
bun test              # smoke + SSR + leak + pure all pass
bun run build         # dist: hamo.mjs + hamo.cjs + d.ts; unminified; "use client" only where needed
bun --filter playground dev   # playground still resolves `hamo` and runs
```

- Inspect generated `package.json` `exports` → has `import` / `require` / `types`.
- Confirm `src/use-object-fit/index.ts` output has **no** `"use client"`; the browser hooks do.
- Optional one-off external cross-check (not a committed dep):
  `npx react-doctor --no-telemetry`.

## Out of scope (deliberately)

- No subpath exports (`hamo/use-rect`) — keeps the public API to the single barrel.
- No minification/polyfills in hamo — the consuming framework owns that.
- No React 17 in the support matrix (runtime-compatible, but untested for v1).
