/* refs for es6 import/export (japanese)
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import
 * https://qiita.com/kiyodori/items/01d07d5c0659e539ecb9
 */

export function hello () {
  console.log('Hello, World')
  window.alert('Hello, World')
}

// ------------------------------------------------------------
// async - await exercise
// refs : https://qiita.com/soarflat/items/1a9613e023200bbebcb3
// (needs npm i -D babel-polyfill)
//

export async function resolveSample () {
  return 'resolve!!'
}

export async function rejectSample () {
  throw new Error('reject!!')
}

export function resolveError () {
  return 'resolveError!!'
}

function sampleResolve (value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value * 2)
    }, 2000)
  })
}

export async function sample () {
  const result = await sampleResolve(5)
  return result + 5
}

// ------------------------------------------------------------
