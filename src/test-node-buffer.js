// Node.js only
const assert = require('assert')

function assertarr (a1, a2) {
  assert(a1.length === a2.length)
  for (let i = 0; i < a1.length; i++) {
    assert(a1[i] === a2[i])
  }
}

describe('Node.js Buffer usage demo', function () {
  // from https://nodejs.org/api/buffer.html
  // from https://mag.osdn.jp/13/04/09/193000
  it('empty Buffer', function () {
    const buf0 = Buffer.alloc(0)
    assert(buf0.length === 0)
    assert(Buffer.isBuffer(buf0))
    assert(Buffer.isBuffer(1234) === false)
    try {
      buf0.writeUInt8(0x0, 0)
      assert(false)
    } catch (e) {
      assert(e instanceof RangeError)
      assert(e.message === 'Index out of range')
    }
  })
  it('Buffer#from, toString()', function () {
    const buf0 = Buffer.from([0, 1, 2, 0x7F, 0x80, 0xFF])
    assertarr(buf0, Buffer.from([0, 1, 2, 0x7F, 0x80, 0xFF]))
    const str0 = '\u3053\u3093\u306B\u3061\u306F' // 「こんにちは」
    const buf1 = Buffer.from(str0, 'utf8')
    assertarr(buf1, Buffer.from([0xE3, 0x81, 0x93, 0xE3, 0x82, 0x93, 0xE3, 0x81, 0xAB, 0xE3, 0x81, 0xA1, 0xE3, 0x81, 0xAF]))
    assert(buf1.toString('utf8') === str0)
    const buf2 = Buffer.from(str0, 'utf16le')
    assertarr(buf2, Buffer.from([0x53, 0x30, 0x93, 0x30, 0x6B, 0x30, 0x61, 0x30, 0x6F, 0x30]))
    assert(buf2.toString('utf16le') === str0)

    // 'latin1' : save 0x00 - 0xFF safely.
    const buf3 = Buffer.alloc(0x100)
    for (let i = 0; i <= 0xFF; i++) {
      buf3.writeUInt8(i, i)
    }
    const str1a = buf3.toString('latin1')
    const buf4a = Buffer.from(str1a, 'latin1')
    assertarr(buf3, buf4a)

    // 'ascii' : strip the high bit if set
    const str1b = buf3.toString('ascii')
    const buf4b = Buffer.from(str1b, 'ascii')
    const buf4c = Buffer.alloc(0x100)
    for (let i = 0; i <= 0x7F; i++) {
      buf4c.writeUInt8(i, i)
    }
    for (let i = 0x80; i <= 0xFF; i++) {
      buf4c.writeUInt8(i - 0x80, i)
    }
    assertarr(buf4b, buf4c)
  })
  it('Buffer/Typed Array slice() difference', function () {
    // from https://techblog.yahoo.co.jp/advent-calendar-2016/node_new_buffer/
    const buf0 = Buffer.from([1, 2, 3])
    const buf1 = buf0.slice(1)
    buf0[2] = 4
    assert(buf1[0] === 2)
    assert(buf1[1] === 4)
    const uint8a0 = new Uint8Array([1, 2, 3])
    const uint8a1 = uint8a0.slice(1)
    uint8a0[2] = 4
    assert(uint8a1[0] === 2)
    assert(uint8a1[1] === 3) // copied
  })
  it('Buffer number read/write', function () {
    const testbuf = Buffer.alloc(16, 0)
    assert(testbuf.length === 16)
    assert(testbuf[0] === 0)
    assert(testbuf[15] === 0)
    testbuf.fill(0xFF)
    assert(testbuf[0] === 0xFF)
    assert(testbuf[15] === 0xFF)
    assert(testbuf.writeUInt16BE(0x1234, 0) === 2)
    assert(testbuf.writeUInt16LE(0x5678, 2) === 4)
    assert(testbuf.writeUInt32BE(0x12345678, 4) === 8)
    assert(testbuf.writeUInt32LE(0x87654321, 8) === 12)
    assert(testbuf.writeUInt8(0x12, 12) === 13)
    assert(testbuf.writeUInt8(0x34, 13) === 14)
    assert(testbuf.writeUInt8(0x56, 14) === 15)
    assert(testbuf.writeUInt8(0x78, 15) === 16)
    assert(testbuf.readUInt8(0) === 0x12)
    assert(testbuf.readUInt8(1) === 0x34)
    assert(testbuf.readUInt8(2) === 0x78)
    assert(testbuf.readUInt8(3) === 0x56)
    assert(testbuf.readUInt8(4) === 0x12)
    assert(testbuf.readUInt8(5) === 0x34)
    assert(testbuf.readUInt8(6) === 0x56)
    assert(testbuf.readUInt8(7) === 0x78)
    assert(testbuf.readUInt8(8) === 0x21)
    assert(testbuf.readUInt8(9) === 0x43)
    assert(testbuf.readUInt8(10) === 0x65)
    assert(testbuf.readUInt8(11) === 0x87)
    assert(testbuf.readUInt8(12) === 0x12)
    assert(testbuf.readUInt8(13) === 0x34)
    assert(testbuf.readUInt8(14) === 0x56)
    assert(testbuf.readUInt8(15) === 0x78)
  })
  it('Buffer#byteLength', function () {
    const str0 = '\u3053\u3093\u306B\u3061\u306F' // 「こんにちは」
    assert(str0.length === 5)
    assert(Buffer.byteLength(str0, 'utf8') === 15)
    assert(Buffer.byteLength(str0, 'utf16le') === 10)
    assert(Buffer.byteLength('AAECAwQFBg==', 'base64') === 7)
    assert(Buffer.byteLength('00010203040506', 'hex') === 7)
  })
})
