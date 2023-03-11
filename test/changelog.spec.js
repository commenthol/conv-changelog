import assert from 'node:assert'
import { Changelog } from '../src/changelog.js'
// import debug from 'debug'

// const log = debug('test:changelog')

describe('Changelog', function () {
  describe('nextVersion()', function () {
    it('first version', function () {
      const cl = new Changelog()
      cl._items = [
        {
          type: 'fix'
        }
      ]
      const next = cl.nextVersion()
      assert.equal(next, '0.0.1')
    })

    it('first version staring at 1.2.3', function () {
      const cl = new Changelog()
      cl._items = [
        {
          type: 'fix'
        }
      ]
      const next = cl.nextVersion('1.2.3')
      assert.equal(next, '1.2.4')
    })

    it('fix version', function () {
      const cl = new Changelog()
      cl._items = [
        {
          type: 'fix'
        },
        {
          versions: [{ version: '1.0.0' }]
        }
      ]
      const next = cl.nextVersion()
      assert.equal(next, '1.0.1')
    })

    it('feature version', function () {
      const cl = new Changelog()
      cl._items = [
        {
          type: 'feat'
        },
        {
          versions: [{ version: '1.0.0' }]
        }
      ]
      const next = cl.nextVersion()
      assert.equal(next, '1.1.0')
    })

    it('BREAKING CHANGE', function () {
      const cl = new Changelog()
      cl._items = [
        {
          type: 'BREAKING CHANGE'
        },
        {
          versions: [{ version: '1.0.0' }]
        }
      ]
      const next = cl.nextVersion()
      assert.equal(next, '2.0.0')
    })
  })
})
