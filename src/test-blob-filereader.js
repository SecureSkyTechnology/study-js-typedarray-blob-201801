// Browser only
const assert = require('assert')

// FileReader API を Promise化する。
// refs : http://numb86-tech.hatenablog.com/entry/2017/04/02/212259
// refs : https://stackoverflow.com/questions/34495796/javascript-promises-with-filereader
function syncFileReadAsText (blob) {
  return new Promise((resolve, reject) => {
    var fr = new FileReader()
    fr.onload = () => {
      if (fr.error) {
        reject(fr.error)
      } else {
        resolve(fr.result)
      }
    }
    fr.readAsText(blob)
  })
}
function syncFileReadAsArrayBuffer (blob) {
  return new Promise((resolve, reject) => {
    var fr = new FileReader()
    fr.onload = () => {
      if (fr.error) {
        reject(fr.error)
      } else {
        resolve(fr.result)
      }
    }
    fr.readAsArrayBuffer(blob)
  })
}
function syncFileReadAsDataURL (blob) {
  return new Promise((resolve, reject) => {
    var fr = new FileReader()
    fr.onload = () => {
      if (fr.error) {
        reject(fr.error)
      } else {
        resolve(fr.result)
      }
    }
    fr.readAsDataURL(blob)
  })
}

describe('Blob and FileReader API', function () {
  // refs : https://developer.mozilla.org/ja/docs/Web/API/Blob
  // refs : https://developer.mozilla.org/ja/docs/Web/API/FileReader
  // refs : https://qiita.com/TypoScript/items/0d5b08cecf959b8b822c
  // refs : https://hakuhin.jp/js/file.html
  it('empty Blob', function () {
    const blob0 = new Blob()
    assert(blob0.type === '')
    assert(blob0.size === 0)
  })
  it('textual Blob', function () {
    const blob0 = new Blob(['hello', 'world'], {type: 'text/plain'})
    assert(blob0.type === 'text/plain')
    assert(blob0.size === 10)
    // MochaでのPromiseテストサポートについて
    // refs : http://numb86-tech.hatenablog.com/entry/2017/04/02/212259
    // refs : http://efcl.info/2014/0314/res3708/
    return syncFileReadAsText(blob0).then((result) => {
      assert(result === 'helloworld')
    })
  })
  it('binary Blob', function () {
    const uint8a1 = new Uint8Array([0x00, 0x01, 0x02])
    const uint8a2 = new Uint8Array([0x03, 0x04, 0x05, 0x06])
    const blob0 = new Blob([uint8a1, uint8a2], {type: 'application/octet-stream'})
    assert(blob0.type === 'application/octet-stream')
    assert(blob0.size === 7)
    return syncFileReadAsArrayBuffer(blob0).then((result) => {
      const uint8r0 = new Uint8Array(result)
      assert(uint8r0.length === 7)
      assert(uint8r0[0] === 0x00)
      assert(uint8r0[1] === 0x01)
      assert(uint8r0[2] === 0x02)
      assert(uint8r0[3] === 0x03)
      assert(uint8r0[4] === 0x04)
      assert(uint8r0[5] === 0x05)
      assert(uint8r0[6] === 0x06)
    })
  })
  it('Blob to DataURL', function () {
    const uint8a1 = new Uint8Array([0x00, 0x01, 0x02])
    const uint8a2 = new Uint8Array([0x03, 0x04, 0x05, 0x06])
    const blob0 = new Blob([uint8a1, uint8a2], {type: 'application/octet-stream'})
    return syncFileReadAsDataURL(blob0).then((result) => {
      // 0x00, ..., 0x06 を Base64エンコードした DataURL が返ってくるはず。
      assert(result === 'data:application/octet-stream;base64,AAECAwQFBg==')
    })
  })
})
