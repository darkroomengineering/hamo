import { defineConfig } from 'tsdown'

// Library build, delegating minification/polyfilling to the consuming framework
// (Next.js, React Router, TanStack, …). We ship modern, unminified, dual ESM+CJS
// output. `unbundle` preserves the per-file `"use client"` directives so the pure
// utilities (useObjectFit) stay usable in Server Components.
export default defineConfig({
  entry: {
    hamo: 'src/index.ts',
    'use-scroll-trigger/debugger': 'src/use-scroll-trigger/debugger.tsx',
  },
  outDir: 'dist',
  target: 'es2022',
  platform: 'neutral',
  format: ['esm', 'cjs'],
  // lenis is an optional peer (useScrollTrigger falls back to native scroll);
  // never bundle it.
  external: [/^lenis(\/|$)/],
  unbundle: true,
  dts: true,
  // No sourcemaps in the published package: the output is modern, unminified
  // es2022 and tiny, so maps would only bloat the tarball (~2x) for no real
  // debugging benefit to consumers.
  sourcemap: false,
  clean: true,
  outExtensions: ({ format }) => ({
    js: format === 'es' ? '.mjs' : '.cjs',
    dts: format === 'es' ? '.d.ts' : '.d.cts',
  }),
})
