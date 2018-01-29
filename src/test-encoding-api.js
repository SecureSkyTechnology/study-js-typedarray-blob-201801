// Browser only
const assert = require('assert')

function assertarr (a1, a2) {
  assert(a1.length === a2.length)
  for (let i = 0; i < a1.length; i++) {
    assert(a1[i] === a2[i])
  }
}

describe('Encoding API', function () {
  // refs : https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API
  // refs : https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
  // refs : https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
  // refs : https://qiita.com/masakielastic/items/8eb4bf4efc2310ee7baf
  it('TextEncoder/Decoder typical usage', function () {
    const str0 = '\u3053\u3093\u306B\u3061\u306F' // 「こんにちは」
    const uint8a0 = (new TextEncoder()).encode(str0)
    assertarr(uint8a0, new Uint8Array([0xE3, 0x81, 0x93, 0xE3, 0x82, 0x93, 0xE3, 0x81, 0xAB, 0xE3, 0x81, 0xA1, 0xE3, 0x81, 0xAF]))
    assert((new TextDecoder('utf-8')).decode(uint8a0) === str0)
  })
  it('TextEncoder only accepts utf-8', function () {
    const str0 = '\u3053\u3093\u306B\u3061\u306F' // 「こんにちは」
    const uint8a0 = (new TextEncoder('euc-jp')).encode(str0)
    // UTF-8 byte array
    assertarr(uint8a0, new Uint8Array([0xE3, 0x81, 0x93, 0xE3, 0x82, 0x93, 0xE3, 0x81, 0xAB, 0xE3, 0x81, 0xA1, 0xE3, 0x81, 0xAF]))
    assert((new TextDecoder('utf-8')).decode(uint8a0) === str0)
  })
  it('TextDecoder other encodings', function () {
    const str0 = '\u3053\u3093\u306B\u3061\u306F' // 「こんにちは」
    const buf0 = new Uint8Array([0xA4, 0xB3, 0xA4, 0xF3, 0xA4, 0xCB, 0xA4, 0xC1, 0xA4, 0xCF])
    assert((new TextDecoder('euc-jp')).decode(buf0) === str0)
    const buf1 = new Uint8Array([0x82, 0xB1, 0x82, 0xF1, 0x82, 0xC9, 0x82, 0xBF, 0x82, 0xCD])
    assert((new TextDecoder('Shift_JIS')).decode(buf1) === str0)
    const buf2 = new Uint8Array([0x1B, 0x24, 0x42, 0x24, 0x33, 0x24, 0x73, 0x24, 0x4B, 0x24, 0x41, 0x24, 0x4F, 0x1B, 0x28, 0x42])
    assert((new TextDecoder('iso-2022-jp')).decode(buf2) === str0)
  })
})
