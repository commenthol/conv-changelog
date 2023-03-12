import assert from 'node:assert'
import sinon from 'sinon'
import { formatLines, formatByGroups } from '../src/format.js'
import { items } from './fixtures/logs.js'
import debug from 'debug'

const log = debug('test:format')

describe('format', function () {
  before(function () {
    this.clock = sinon.useFakeTimers(new Date('2023-03-05T12:00:00Z'))
  })
  after(function () {
    this.clock.restore()
  })

  describe('formatLines()', function () {
    it('shall format lines', function () {
      const formatted = formatLines(items)
      log('%j', formatted)
      assert.deepEqual(formatted, [
        '#  (2023-03-05)\n' +
        '\n' +
        '- feat(#123): foo feature (#c478182)\n' +
        '- fix: cjs bundling with rollup (#44ef857)\n' +
        '\n',
        '# 3.4.2 (2022-11-20)\n' +
        '\n' +
        '- chore: bump (#ea6e424)\n' +
        '- chore: update action to v3 (#790146f)\n' +
        '- chore: bump dependencies (#b96ae04)\n' +
        '- chore: bump astronomia (#93af56f)\n' +
        '\n'
      ])
    })

    it('shall format lines with nextVersion', function () {
      const formatted = formatLines(items, { nextVersion: '3.5.0' })
      log('%j', formatted)
      assert.deepEqual(formatted, [
        '# 3.5.0 (2023-03-05)\n' +
        '\n' +
        '- feat(#123): foo feature (#c478182)\n' +
        '- fix: cjs bundling with rollup (#44ef857)\n' +
        '\n',
        '# 3.4.2 (2022-11-20)\n' +
        '\n' +
        '- chore: bump (#ea6e424)\n' +
        '- chore: update action to v3 (#790146f)\n' +
        '- chore: bump dependencies (#b96ae04)\n' +
        '- chore: bump astronomia (#93af56f)\n' +
        '\n'
      ])
    })

    it('shall format lines with url & nextVersion', function () {
      const formatted = formatLines(items, {
        nextVersion: '3.5.0',
        url: 'https://foo.bar'
      })
      log('%j', formatted)
      assert.deepEqual(formatted, [
        '# [3.5.0](https://foo.bar/3.4.2..3.5.0) (2023-03-05)\n\n- feat(#123): foo feature [#c478182](https://foo.bar/c4781824a50bcbcd3da1bf0b5ede267551d8b7bd)\n- fix: cjs bundling with rollup [#44ef857](https://foo.bar/44ef857054af30c89da89f26fa21c08f8140a7c0)\n\n',
        '# [3.4.2](https://foo.bar/3.4.1..3.4.2) (2022-11-20)\n\n- chore: bump [#ea6e424](https://foo.bar/ea6e424e588315dc10520976b06da133f1598a4e)\n- chore: update action to v3 [#790146f](https://foo.bar/790146fe8c4cf2d98a5be326ce509db8279d7d04)\n- chore: bump dependencies [#b96ae04](https://foo.bar/b96ae045acb2799d1211171bbe95ad6b689483f4)\n- chore: bump astronomia [#93af56f](https://foo.bar/93af56f59442fdd7c7887696243c984cdad0a8f1)\n\n'
      ])
    })

    it('format type with empty commit', function () {
      const items = [
        {
          short: 'c478182',
          hash: 'c4781824a50bcbcd3da1bf0b5ede267551d8b7bd',
          date: new Date('2022-12-13T07:19:07.000Z'),
          mail: 'alice@foo.bar',
          subject: 'wip:',
          versions: [],
          type: 'wip',
          subtype: '',
          subjectType: ''
        }
      ]
      const formatted = formatLines(items, { nextVersion: '3.5.0' })
      log('%j', formatted)
      log('%s', formatted.join(''))
      assert.deepEqual(formatted, [
        '# 3.5.0 (2023-03-05)\n\n- wip: (#c478182)\n\n'
      ])
    })

    it('format type with empty commit without hash', function () {
      const items = [
        {
          short: 'c478182',
          hash: 'c4781824a50bcbcd3da1bf0b5ede267551d8b7bd',
          date: new Date('2022-12-13T07:19:07.000Z'),
          mail: 'alice@foo.bar',
          subject: 'wip:',
          versions: [],
          type: 'wip',
          subtype: '',
          subjectType: ''
        }
      ]
      const formatted = formatLines(items, { nextVersion: '3.5.0', useHash: false })
      log('%j', formatted)
      log('%s', formatted.join(''))
      assert.deepEqual(formatted, [
        '# 3.5.0 (2023-03-05)\n\n- wip:\n\n'
      ])
    })
  })

  describe('formatByGroups()', function () {
    it('shall format', function () {
      const formatted = formatByGroups(items)
      log('%j', formatted)
      log('%s', formatted.join(''))
      assert.deepEqual(formatted, [
        '#  (2023-03-05)\n' +
        '\n' +
        '### feat:\n' +
        '\n' +
        '- #123: foo feature (#c478182)\n' +
        '\n' +
        '### fix:\n' +
        '\n' +
        '- cjs bundling with rollup (#44ef857)\n' +
        '\n',
        '# 3.4.2 (2022-11-20)\n' +
        '\n' +
        '### chore:\n' +
        '\n' +
        '- bump (#ea6e424)\n' +
        '- update action to v3 (#790146f)\n' +
        '- bump dependencies (#b96ae04)\n' +
        '- bump astronomia (#93af56f)\n' +
        '\n'
      ])
    })

    it('shall format lines with nextVersion', function () {
      const formatted = formatByGroups(items, { nextVersion: '3.5.0' })
      log('%j', formatted)
      log('%s', formatted.join(''))
      assert.deepEqual(formatted, [
        '# 3.5.0 (2023-03-05)\n' +
        '\n' +
        '### feat:\n' +
        '\n' +
        '- #123: foo feature (#c478182)\n' +
        '\n' +
        '### fix:\n' +
        '\n' +
        '- cjs bundling with rollup (#44ef857)\n' +
        '\n',
        '# 3.4.2 (2022-11-20)\n' +
        '\n' +
        '### chore:\n' +
        '\n' +
        '- bump (#ea6e424)\n' +
        '- update action to v3 (#790146f)\n' +
        '- bump dependencies (#b96ae04)\n' +
        '- bump astronomia (#93af56f)\n' +
        '\n'
      ])
    })

    it('shall format lines with url & nextVersion', function () {
      const formatted = formatByGroups(items, {
        nextVersion: '3.5.0',
        url: 'https://foo.bar'
      })
      log('%j', formatted)
      log('%s', formatted.join(''))
      assert.deepEqual(formatted, [
        '# [3.5.0](https://foo.bar/3.4.2..3.5.0) (2023-03-05)\n\n### feat:\n\n- #123: foo feature [#c478182](https://foo.bar/c4781824a50bcbcd3da1bf0b5ede267551d8b7bd)\n\n### fix:\n\n- cjs bundling with rollup [#44ef857](https://foo.bar/44ef857054af30c89da89f26fa21c08f8140a7c0)\n\n',
        '# [3.4.2](https://foo.bar/3.4.1..3.4.2) (2022-11-20)\n\n### chore:\n\n- bump [#ea6e424](https://foo.bar/ea6e424e588315dc10520976b06da133f1598a4e)\n- update action to v3 [#790146f](https://foo.bar/790146fe8c4cf2d98a5be326ce509db8279d7d04)\n- bump dependencies [#b96ae04](https://foo.bar/b96ae045acb2799d1211171bbe95ad6b689483f4)\n- bump astronomia [#93af56f](https://foo.bar/93af56f59442fdd7c7887696243c984cdad0a8f1)\n\n'
      ])
    })

    it('format type with empty commit', function () {
      const items = [
        {
          short: 'c478182',
          hash: 'c4781824a50bcbcd3da1bf0b5ede267551d8b7bd',
          date: new Date('2022-12-13T07:19:07.000Z'),
          mail: 'alice@foo.bar',
          subject: 'wip:',
          versions: [],
          type: 'wip',
          subtype: '',
          subjectType: ''
        }
      ]
      const formatted = formatByGroups(items, { nextVersion: '3.5.0' })
      log('%j', formatted)
      log('%s', formatted.join(''))
      assert.deepEqual(formatted, [
        '# 3.5.0 (2023-03-05)\n\n' +
        '### wip:\n\n' +
        '- wip: (#c478182)\n\n'
      ])
    })

    it('format commit with empty type', function () {
      const items = [
        {
          short: 'c478182',
          hash: 'c4781824a50bcbcd3da1bf0b5ede267551d8b7bd',
          date: new Date('2022-12-13T07:19:07.000Z'),
          mail: 'alice@foo.bar',
          subject: 'initial commit',
          versions: [],
          type: '',
          subtype: '',
          subjectType: ''
        }
      ]
      const formatted = formatByGroups(items, { nextVersion: '3.5.0' })
      log('%j', formatted)
      log('%s', formatted.join(''))
      assert.deepEqual(formatted, [
        '# 3.5.0 (2023-03-05)\n\n### other:\n\n- initial commit (#c478182)\n\n'
      ])
    })

    it('format commit with empty type useHash=false', function () {
      const items = [
        {
          short: 'c478182',
          hash: 'c4781824a50bcbcd3da1bf0b5ede267551d8b7bd',
          date: new Date('2022-12-13T07:19:07.000Z'),
          mail: 'alice@foo.bar',
          subject: 'initial commit',
          versions: [],
          type: '',
          subtype: '',
          subjectType: ''
        }
      ]
      const formatted = formatByGroups(items, { nextVersion: '3.5.0', useHash: false })
      log('%j', formatted)
      log('%s', formatted.join(''))
      assert.deepEqual(formatted, [
        '# 3.5.0 (2023-03-05)\n\n### other:\n\n- initial commit\n\n'
      ])
    })
  })
})
