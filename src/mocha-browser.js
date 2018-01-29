// run mocha test from browser
/* jquery, mocha.css, mocha.js については import や実行時のrequire()に頼らずとも、
 * copy-webpack-plugin 使って node_modules 以下から手動で build/ にコピペしてきて、
 * HTML側で普通にロードするだけでも良かったかもしれない。(；´Д｀)
 */
import jQuery from 'jquery'
const $ = jQuery
// confirm jquery version string.
console.log($().jquery)

// invoke at runtime on browser.
require('mocha/mocha.css')
require('mocha/mocha.js')

mocha.setup('bdd')
require('./test-mocha-demo')
require('./test-typed-array')
require('./test-blob-filereader')
require('./test-encoding-api')
$(function () {
  mocha.run()
})
