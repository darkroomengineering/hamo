import { defineConfig } from 'vite'
// import { dependencies, peerDependencies } from './package.json'

export default defineConfig(({ command }) => {
  if (command === 'build') {
    return {
      build: {
        ssr: true,
        lib: {
          entry: './src/index.mjs',
          name: '@studio-sfreight/hamo',
        },
        outDir: './bundled',
        chunkSizeWarningLimit: 3000,
        rollupOptions: {
          // external: [...Object.keys(dependencies || {}), ...Object.keys(peerDependencies || {})],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              '@studio-freight/tempus': '@studio-freight/tempus',
              'throttle-debounce': 'throttle-debounce',
            },
          },
        },
      },
    }
  } else {
    return {
      root: './docs/',
    }
  }
})
