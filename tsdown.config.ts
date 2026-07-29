import { defineConfig } from 'tsdown'

const shared = {
  outDir: 'dist',
  target: 'es2022' as const,
  platform: 'browser' as const,
  format: 'esm' as const,
  sourcemap: true,
  outExtensions: () => ({ js: '.mjs', dts: '.d.ts' }),
}

export default defineConfig([
  // React ESM
  {
    ...shared,
    entry: {
      hamo: 'packages/react/index.ts',
      'scroll-trigger': 'packages/react/scroll-trigger/index.ts',
      'scroll-trigger/debugger': 'packages/react/scroll-trigger/debugger.ts',
    },
    dts: true,
    clean: true,
    banner: '"use client";',
    deps: { neverBundle: ['react', 'lenis', 'hamo'] },
  },
])
