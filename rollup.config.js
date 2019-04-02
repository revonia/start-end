const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify').uglify

const production = process.env.NODE_ENV === 'production'

module.exports = {
  input: 'src/index.js',
  output: {
    file: production ? 'dist/start-end.min.js' : 'dist/start-end.js',
    format: 'umd',
    name: 'StartEnd',
    sourcemap: true
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    production && uglify()
  ]
}
