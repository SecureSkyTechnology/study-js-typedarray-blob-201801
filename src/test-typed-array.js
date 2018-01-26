// Node and Browser
const assert = require('assert')
// refs : https://developer.mozilla.org/ja/docs/Web/JavaScript/Typed_arrays
// refs : https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
describe('Typed Arrays', function () {
  describe('ArrayBuffer', function () {
    it('ArrayBuffer length and view', function () {
      const testbuf = new ArrayBuffer(16)
      assert(testbuf.byteLength === 16)
      const uint8view = new Uint8Array(testbuf)
      uint8view.fill(0)
      const uint16view1 = new Uint16Array(testbuf, 0, 2)
      uint16view1[0] = 0x1234
      uint16view1[1] = 0x5678
      const uint32view1 = new Uint32Array(testbuf, 4, 2)
      uint32view1[0] = 0x12345678
      uint32view1[1] = 0x87654321
      const uint8view2 = new Uint8Array(testbuf, 12, 4)
      uint8view2[0] = 0x12
      uint8view2[1] = 0x34
      uint8view2[2] = 0x56
      uint8view2[3] = 0x78
      assert(uint8view[0x00] === 0x34)
      assert(uint8view[0x01] === 0x12)
      assert(uint8view[0x02] === 0x78)
      assert(uint8view[0x03] === 0x56)
      assert(uint8view[0x04] === 0x78)
      assert(uint8view[0x05] === 0x56)
      assert(uint8view[0x06] === 0x34)
      assert(uint8view[0x07] === 0x12)
      assert(uint8view[0x08] === 0x21)
      assert(uint8view[0x09] === 0x43)
      assert(uint8view[0x0a] === 0x65)
      assert(uint8view[0x0b] === 0x87)
      assert(uint8view[0x0c] === 0x12)
      assert(uint8view[0x0d] === 0x34)
      assert(uint8view[0x0e] === 0x56)
      assert(uint8view[0x0f] === 0x78)
    })
  })
  describe('Uint8Array', function () {
    // refs : https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
    it('basic usage', function () {
      const a1 = new Uint8Array(2)
      a1.fill(0)
      assert(a1[0] === 0)
      assert(a1[1] === 0)
      a1[0] = 1
      a1[1] = 2
      assert(a1[0] === 1)
      assert(a1[1] === 2)
      assert(a1.length === 2)
      assert(a1.BYTES_PER_ELEMENT === 1)
      const a2 = new Uint8Array([1, 2, 3])
      assert(a2[0] === 1)
      assert(a2[1] === 2)
      assert(a2[2] === 3)
      assert(a2.length === 3)
      const buf1 = new ArrayBuffer(8)
      const view1 = new Uint8Array(buf1)
      for (let i = 0; i < view1.length; i++) {
        view1[i] = i
      }
      const view2 = new Uint8Array(buf1, 2, 4)
      assert(view2.length === 4)
      assert(view2[0] === 2)
      assert(view2[1] === 3)
      assert(view2[2] === 4)
      assert(view2[3] === 5)
    })
  })
  describe('Uint32Array', function () {
    it('basic usage', function () {
      const a1 = new Uint32Array(2)
      a1.fill(0)
      assert(a1[0] === 0)
      assert(a1[1] === 0)
      a1[0] = 0x12345678
      a1[1] = 0x87654321
      assert(a1[0] === 0x12345678)
      assert(a1[1] === 0x87654321)
      assert(a1.length === 2)
      assert(a1.BYTES_PER_ELEMENT === 4)
      const uint8view = new Uint8Array(a1)
      assert(uint8view.length === 2)
      assert(uint8view[0] === 0x78)
      assert(uint8view[1] === 0x21)
      const buf1 = new ArrayBuffer(8)
      const uint32view1 = new Uint32Array(buf1)
      assert(uint32view1.length === 2)
      uint32view1[0] = 0x12345678
      uint32view1[1] = 0x87654321
      const uint8view1 = new Uint8Array(buf1)
      assert(uint8view1.length === 8)
      assert(uint8view1[0] === 0x78)
      assert(uint8view1[1] === 0x56)
      assert(uint8view1[2] === 0x34)
      assert(uint8view1[3] === 0x12)
      assert(uint8view1[4] === 0x21)
      assert(uint8view1[5] === 0x43)
      assert(uint8view1[6] === 0x65)
      assert(uint8view1[7] === 0x87)
    })
  })
})
