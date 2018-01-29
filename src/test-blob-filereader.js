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
  // refs : https://developer.mozilla.org/ja/docs/Web/API/File
  // refs : https://developer.mozilla.org/ja/docs/Web/API/FileReader
  // Blob, File, FileReader のコンストラクタ・属性などの詳細はW3Cを参照したほうが正確で分かりやすい。
  // refs : https://www.w3.org/TR/FileAPI/ (W3C Working Draft)
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
  it('Blob to simple File', function () {
    const uint8a1 = new Uint8Array([0x00, 0x01, 0x02])
    const uint8a2 = new Uint8Array([0x03, 0x04, 0x05, 0x06])
    const blob0 = new Blob([uint8a1, uint8a2], {type: 'application/octet-stream'})
    const file0 = new File([blob0], 'testdata.bin')
    assert(file0.name === 'testdata.bin')
    assert(file0.type === '') // option未指定なら空文字列となる。(= Blob.typeからは引き継がれない)
    assert(file0.lastModified !== 0) // option未指定なら現在日付となる。
    assert(file0.size === 7)
    return syncFileReadAsDataURL(file0).then((result) => {
      // 0x00, ..., 0x06 を Base64エンコードした DataURL が返ってくるはず。
      // またデフォルトではtypeが空文字列となるため、MIMEのフィールドは空文字列になる。
      assert(result === 'data:;base64,AAECAwQFBg==')
    })
  })
  it('Blob to File with options', function () {
    const uint8a1 = new Uint8Array([0x00, 0x01, 0x02])
    const uint8a2 = new Uint8Array([0x03, 0x04, 0x05, 0x06])
    const blob0 = new Blob([uint8a1, uint8a2], {type: 'application/octet-stream'})
    const file0 = new File([blob0], 'testdata.bin', {type: 'text/plain', lastModified: 10})
    assert(file0.name === 'testdata.bin')
    assert(file0.type === 'text/plain')
    assert(file0.lastModified === 10)
    assert(file0.size === 7)
    return syncFileReadAsDataURL(file0).then((result) => {
      // 0x00, ..., 0x06 を Base64エンコードした DataURL が返ってくるはず。
      assert(result === 'data:text/plain;base64,AAECAwQFBg==')
    })
  })
  it('Blob to File (mixed MIME blob)', function () {
    const uint8a1 = new Uint8Array([0x00, 0x01, 0x02])
    const uint8a2 = new Uint8Array([0x03, 0x04, 0x05, 0x06])
    const blob1 = new Blob([uint8a1], {type: 'text/plain'})
    const blob2 = new Blob([uint8a2], {type: 'text/html'}) // different mime type
    const file1 = new File([blob1, blob2], 'testdata.bin', {type: 'image/jpeg', lastModified: 20})
    assert(file1.name === 'testdata.bin')
    assert(file1.type === 'image/jpeg')
    assert(file1.lastModified === 20)
    assert(file1.size === 7)
    return syncFileReadAsDataURL(file1).then((result) => {
      // 0x00, ..., 0x06 を Base64エンコードした DataURL が返ってくるはず。
      assert(result === 'data:image/jpeg;base64,AAECAwQFBg==')
    })
  })
})
