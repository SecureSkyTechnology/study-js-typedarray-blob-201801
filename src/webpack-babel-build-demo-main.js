/* refs for es6 import/export (japanese)
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import
 * https://qiita.com/kiyodori/items/01d07d5c0659e539ecb9
 */
import * as sub from './webpack-babel-build-demo-sub'

sub.hello()

// ------------------------------------------------------------
// async - await exercise
// refs : https://qiita.com/soarflat/items/1a9613e023200bbebcb3
// (needs npm i -D babel-polyfill)

sub.resolveSample().then(value => {
  console.log(`resolveSample() : ${value}`)
})

sub.rejectSample().catch(err => {
  console.log(`rejectSample() : ${err}`)
})

// cause Uncaught TypeError: __WEBPACK_IMPORTED_MODULE_0__sub__.c(...).then is not a function
/*
sub.resolveError().then(value => {
  console.log(value)
})
*/

sub.sample().then(result => {
  console.log(`sample(): ${result}`)
})

// ------------------------------------------------------------
