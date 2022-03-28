import { uglify } from 'rollup-plugin-uglify'

export default {
  input: 'src/index.js',
  output: [
    {
      // file: pkg.main,
      dir: 'dist',
      format: 'cjs',
      preserveModules: true,
      exports: 'named',
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [uglify()],
  external: ['react', 'react-dom'],
}
