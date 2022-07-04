const { resolve } = require('path')
const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')

module.exports = defineConfig({
  root: resolve(__dirname, 'docs/'),
  define: {
    'process.env.NODE_ENV': process.env.NODE_ENV
  },
  plugins: [react()],
})
