import { defineConfig } from 'tsdown'

// Library build, delegating minification/polyfilling to the consuming framework
// (Next.js, React Router, TanStack, …). We ship modern, unminified, dual ESM+CJS
// output. `unbundle` preserves the per-file `"use client"` directives so the pure
// utilities (useObjectFit) stay usable in Server Components.
export default defineConfig({
  entry: { hamo: 'src/index.ts' },
  outDir: 'dist',
  target: 'es2022',
  platform: 'neutral',
  format: ['esm', 'cjs'],
  unbundle: true,
  dts: true,
  sourcemap: true,
  clean: true,
  outExtensions: ({ format }) => ({
    js: format === 'es' ? '.mjs' : '.cjs',
    dts: format === 'es' ? '.d.ts' : '.d.cts',
  }),
})
