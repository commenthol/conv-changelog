import assert from 'node:assert'
import { incVersion } from '../src/version.js'

describe('version', function () {
  describe('incVersion()', function () {
    it('shall not alter existing prerelease', function () {
      const result = incVersion('0.0.1-0', '0.0.1')
      assert.equal(result, '0.0.1-0')
    })

    it('shall alter into prerelease', function () {
      const result = incVersion('1.0.0', '1.0.1')
      assert.equal(result, '1.0.1-0')
    })

    it('shall alter into prerelease', function () {
      const result = incVersion('1.0.0', '1.0.1')
      assert.equal(result, '1.0.1-0')
    })

    it('shall convert undefined semver into prerelease', function () {
      const result = incVersion('abc', '1.0.1')
      assert.equal(result, '1.0.1-0')
    })
  })
})
