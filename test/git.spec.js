import assert from 'node:assert'
import { Git } from '../src/git.js'
import { raw, sep } from './fixtures/logs.js'
import debug from 'debug'

const log = debug('test:git')

describe('Git', function () {
  describe('parselines()', function () {
    it('shall parse some lines', function () {
      const lines = [
        'c478182|c4781824a50bcbcd3da1bf0b5ede267551d8b7bd| (tag: 1.2.3)|2022-12-13T07:19:07.000Z|a@foo.bar|v1.2.3',
        'e2ccf28|e2ccf283c17ad8663a492dbe70d081d7dcdd78f4||2022-12-13T06:19:07.000Z|b@foo.bar|fix(#123): the hotfix',
        '0733cbd|0733cbd6ec2a4f7c2424b698a9d58db8c17a7705||2022-12-12T06:19:07.000Z|c@foo.bar|feat: cool stuff',
        'c478182|c4781824a50bcbcd3da1bf0b5ede267551d8b7bd||2022-12-13T06:19:07.000Z|b@foo.bar|break: better ingredients',
        'f145db0|f145db0f5e8a4b75b4fcccd6b63af5c5c478182f||2022-12-13T06:19:07.000Z|b@foo.bar|BREAKING CHANGE: much better ingredients',
        '4e8e11e|4e8e11ef5e8a4b75b4fcccd6b63af5c5c478182f||2022-12-13T06:19:07.000Z|b@foo.bar|wip:',
        'b8e1e26|b8e1e2694e8e11ef5e8a4b75b4fcccd6b63af5c5||2022-12-13T06:19:07.000Z|b@foo.bar|',
        '24e9be9|24e9be9cb8e1e2694e8e11ef5e8a4b75b4fcccd6||2022-12-13T06:19:07.000Z|b@foo.bar|initial'
      ]
      const filtered = Git.parseLines(lines, '|')
      log('%j', filtered)
      assert.deepEqual(filtered, [
        {
          short: 'c478182',
          hash: 'c4781824a50bcbcd3da1bf0b5ede267551d8b7bd',
          tags: ['1.2.3'],
          date: new Date('2022-12-13T07:19:07.000Z'),
          mail: 'a@foo.bar',
          subject: 'v1.2.3',
          versions: [
            {
              options: {},
              loose: false,
              includePrerelease: false,
              raw: 'v1.2.3',
              major: 1,
              minor: 2,
              patch: 3,
              prerelease: [],
              build: [],
              version: '1.2.3'
            },
            {
              options: {},
              loose: false,
              includePrerelease: false,
              raw: '1.2.3',
              major: 1,
              minor: 2,
              patch: 3,
              prerelease: [],
              build: [],
              version: '1.2.3'
            }
          ],
          type: '',
          subtype: '',
          subjectType: ''
        },
        {
          short: 'e2ccf28',
          hash: 'e2ccf283c17ad8663a492dbe70d081d7dcdd78f4',
          tags: undefined,
          date: new Date('2022-12-13T06:19:07.000Z'),
          mail: 'b@foo.bar',
          subject: 'fix(#123): the hotfix',
          versions: [],
          type: 'fix',
          subtype: '#123',
          subjectType: 'the hotfix'
        },
        {
          short: '0733cbd',
          hash: '0733cbd6ec2a4f7c2424b698a9d58db8c17a7705',
          tags: undefined,
          date: new Date('2022-12-12T06:19:07.000Z'),
          mail: 'c@foo.bar',
          subject: 'feat: cool stuff',
          versions: [],
          type: 'feat',
          subtype: '',
          subjectType: 'cool stuff'
        },
        {
          short: 'c478182',
          hash: 'c4781824a50bcbcd3da1bf0b5ede267551d8b7bd',
          tags: undefined,
          date: new Date('2022-12-13T06:19:07.000Z'),
          mail: 'b@foo.bar',
          subject: 'break: better ingredients',
          versions: [],
          type: 'break',
          subtype: '',
          subjectType: 'better ingredients'
        },
        {
          short: 'f145db0',
          hash: 'f145db0f5e8a4b75b4fcccd6b63af5c5c478182f',
          tags: undefined,
          date: new Date('2022-12-13T06:19:07.000Z'),
          mail: 'b@foo.bar',
          subject: 'BREAKING CHANGE: much better ingredients',
          versions: [],
          type: 'BREAKING CHANGE',
          subtype: '',
          subjectType: 'much better ingredients'
        },
        {
          date: new Date('2022-12-13T06:19:07.000Z'),
          hash: '4e8e11ef5e8a4b75b4fcccd6b63af5c5c478182f',
          mail: 'b@foo.bar',
          short: '4e8e11e',
          subject: 'wip:',
          subjectType: '',
          subtype: '',
          tags: undefined,
          type: 'wip',
          versions: []
        },
        {
          date: new Date('2022-12-13T06:19:07.000Z'),
          hash: 'b8e1e2694e8e11ef5e8a4b75b4fcccd6b63af5c5',
          mail: 'b@foo.bar',
          short: 'b8e1e26',
          subject: '',
          subjectType: '',
          subtype: '',
          tags: undefined,
          type: '',
          versions: []
        },
        {
          date: new Date('2022-12-13T06:19:07.000Z'),
          hash: '24e9be9cb8e1e2694e8e11ef5e8a4b75b4fcccd6',
          mail: 'b@foo.bar',
          short: '24e9be9',
          subject: 'initial',
          subjectType: '',
          subtype: '',
          tags: undefined,
          type: '',
          versions: []
        }
      ])
    })

    it('shall parse rwa lines', function () {
      const filtered = Git.parseLines(raw.slice(0, 3), sep)
      log('%j', filtered)
      assert.deepEqual(filtered, [
        {
          short: 'c478182',
          hash: 'c4781824a50bcbcd3da1bf0b5ede267551d8b7bd',
          date: new Date('2022-12-13T07:19:07.000Z'),
          mail: 'commenthol@gmail.com',
          subject: 'feat(#123): foo feature',
          versions: [],
          type: 'feat',
          subtype: '#123',
          subjectType: 'foo feature',
          tags: undefined
        },
        {
          short: 'e2ccf28',
          hash: 'e2ccf283c17ad8663a492dbe70d081d7dcdd78f4',
          date: new Date('2022-12-13T07:30:40.000Z'),
          mail: 'commenthol@gmail.com',
          subject: 'chore: changelog',
          versions: [],
          type: 'chore',
          subtype: '',
          subjectType: 'changelog',
          tags: undefined
        },
        {
          short: '0733cbd',
          hash: '0733cbd6ec2a4f7c2424b698a9d58db8c17a7705',
          date: new Date('2022-12-13T07:21:52.000Z'),
          mail: 'noreply@github.com',
          subject: 'Merge pull request #52 from commenthol/fix-rollup-cjs',
          versions: [],
          type: '',
          subtype: '',
          subjectType: '',
          tags: undefined
        }
      ])
    })
  })
})
