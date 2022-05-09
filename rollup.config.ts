import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import uglify from '@lopatnov/rollup-plugin-uglify'

export default {
  input: 'components/index.js',
  output: {
    dir: 'dist',
    sourcemap: true,
    format: 'es',
  },
  external: ['react'],
  plugins: [resolve(), commonjs(), uglify()],
}
