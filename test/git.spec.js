import assert from 'node:assert'
import { Git } from '../src/git.js'
import { raw, sep } from './fixtures/logs.js'
import debug from 'debug'

const log = debug('test:git')

describe('Git', function () {
  describe('parselines()', function () {
    it('breaking change feat!:', function () {
      const lines = ['a|aa||2023-01-01T00:00:00Z||feat!: breaking feature|']
      const filtered = Git.parseLines(lines, '|')
      log('%j', filtered)
      assert.deepEqual(filtered, [
        {
          date: new Date('2023-01-01T00:00:00.000Z'),
          hash: 'aa',
          mail: '',
          short: 'a',
          subject: 'feat!: breaking feature',
          subjectType: 'breaking feature',
          subtype: '',
          tags: undefined,
          type: 'BREAKING CHANGE',
          versions: []
        },
        {
          date: new Date('2023-01-01T00:00:00.000Z'),
          hash: 'aa',
          mail: '',
          short: 'a',
          subject: 'feat!: breaking feature',
          subjectType: 'breaking feature',
          subtype: '',
          tags: undefined,
          type: 'feat',
          versions: []
        }
      ])
    })

    it('breaking change feat(#123)!', function () {
      const lines = ['b|bb||2023-01-01T00:00:00Z||feat(#123)!: 123 breaks|']
      const filtered = Git.parseLines(lines, '|')
      log('%j', filtered)
      assert.deepEqual(filtered, [
        {
          date: new Date('2023-01-01T00:00:00.000Z'),
          hash: 'bb',
          mail: '',
          short: 'b',
          subject: 'feat(#123)!: 123 breaks',
          subjectType: '123 breaks',
          subtype: '#123',
          tags: undefined,
          type: 'BREAKING CHANGE',
          versions: []
        },
        {
          date: new Date('2023-01-01T00:00:00.000Z'),
          hash: 'bb',
          mail: '',
          short: 'b',
          subject: 'feat(#123)!: 123 breaks',
          subjectType: '123 breaks',
          subtype: '#123',
          tags: undefined,
          type: 'feat',
          versions: []
        }
      ])
    })

    it('breaking change using `break:` type', function () {
      const lines = ['c|cc||2023-01-01||break: this breaks|']
      const filtered = Git.parseLines(lines, '|')
      log('%j', filtered)
      assert.deepEqual(filtered, [
        {
          date: new Date('2023-01-01T00:00:00.000Z'),
          hash: 'cc',
          mail: '',
          short: 'c',
          subject: 'break: this breaks',
          subjectType: 'this breaks',
          subtype: '',
          tags: undefined,
          type: 'BREAKING CHANGE',
          versions: []
        }
      ])
    })

    it('breaking change using `BREAKING CHANGE:` type', function () {
      const lines = ['c|cc||2023-01-01||BREAKING CHANGE: this breaks|']
      const filtered = Git.parseLines(lines, '|')
      log('%j', filtered)
      assert.deepEqual(filtered, [
        {
          date: new Date('2023-01-01T00:00:00.000Z'),
          hash: 'cc',
          mail: '',
          short: 'c',
          subject: 'BREAKING CHANGE: this breaks',
          subjectType: 'this breaks',
          subtype: '',
          tags: undefined,
          type: 'BREAKING CHANGE',
          versions: []
        }
      ])
    })

    it('breaking change using footer', function () {
      const lines = [
        'd|dd||2023-01-01||chore!: this breaks|done some things\n\nBREAKING CHANGE: node<=10 discontinued \n\nreviewed: me\n'
      ]
      const filtered = Git.parseLines(lines, '|')
      log('%j', filtered)
      assert.deepEqual(filtered, [
        {
          date: new Date('2023-01-01T00:00:00.000Z'),
          hash: 'dd',
          mail: '',
          short: 'd',
          subject: 'BREAKING CHANGE: node<=10 discontinued',
          subjectType: 'node<=10 discontinued',
          subtype: '',
          tags: undefined,
          type: 'BREAKING CHANGE',
          versions: []
        },
        {
          date: new Date('2023-01-01T00:00:00.000Z'),
          hash: 'dd',
          mail: '',
          short: 'd',
          subject: 'chore!: this breaks',
          subjectType: 'this breaks',
          subtype: '',
          tags: undefined,
          type: 'chore',
          versions: []
        }
      ])
    })

    it('breaking change using footer only', function () {
      const lines = [
        'd|dd||2023-01-01||chore: this breaks|done some things\n\nBREAKING CHANGE: node<=10 discontinued \n\nreviewed: me\n'
      ]
      const filtered = Git.parseLines(lines, '|')
      log('%j', filtered)
      assert.deepEqual(filtered, [
        {
          date: new Date('2023-01-01T00:00:00.000Z'),
          hash: 'dd',
          mail: '',
          short: 'd',
          subject: 'BREAKING CHANGE: node<=10 discontinued',
          subjectType: 'node<=10 discontinued',
          subtype: '',
          tags: undefined,
          type: 'BREAKING CHANGE',
          versions: []
        },
        {
          date: new Date('2023-01-01T00:00:00.000Z'),
          hash: 'dd',
          mail: '',
          short: 'd',
          subject: 'chore: this breaks',
          subjectType: 'this breaks',
          subtype: '',
          tags: undefined,
          type: 'chore',
          versions: []
        }
      ])
    })

    it('shall parse some lines', function () {
      const lines = [
        'c478182|c4781824a50bcbcd3da1bf0b5ede267551d8b7bd| (tag: 1.2.3)|2022-12-13T07:19:07.000Z|a@foo.bar|v1.2.3|',
        'e2ccf28|e2ccf283c17ad8663a492dbe70d081d7dcdd78f4||2022-12-13T06:19:07.000Z|b@foo.bar|fix(#123): the hotfix|',
        '0733cbd|0733cbd6ec2a4f7c2424b698a9d58db8c17a7705||2022-12-12T06:19:07.000Z|c@foo.bar|feat: cool stuff|',
        '102e82e|102e82e10733cbd6ec2a4f7c2424b698a9d58db8||2022-12-12T06:19:07.000Z|c@foo.bar|feat!: cool stuff that breaks|',
        'c478182|c4781824a50bcbcd3da1bf0b5ede267551d8b7bd||2022-12-13T06:19:07.000Z|b@foo.bar|break: better ingredients|',
        'f145db0|f145db0f5e8a4b75b4fcccd6b63af5c5c478182f||2022-12-13T06:19:07.000Z|b@foo.bar|BREAKING CHANGE: much better ingredients|',
        '4e8e11e|4e8e11ef5e8a4b75b4fcccd6b63af5c5c478182f| (tag: sometag)|2022-12-13T06:19:07.000Z|b@foo.bar|wip:|',
        'b8e1e26|b8e1e2694e8e11ef5e8a4b75b4fcccd6b63af5c5||2022-12-13T06:19:07.000Z|b@foo.bar||',
        '24e9be9|24e9be9cb8e1e2694e8e11ef5e8a4b75b4fcccd6||2022-12-13T06:19:07.000Z|b@foo.bar|initial|'
      ]
      const filtered = Git.parseLines(lines, '|')
      log('%j', filtered)
      assert.deepEqual(JSON.parse(JSON.stringify(filtered)), [
        {
          short: 'c478182',
          hash: 'c4781824a50bcbcd3da1bf0b5ede267551d8b7bd',
          tags: ['1.2.3'],
          date: '2022-12-13T07:19:07.000Z',
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
          date: '2022-12-13T06:19:07.000Z',
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
          date: '2022-12-12T06:19:07.000Z',
          mail: 'c@foo.bar',
          subject: 'feat: cool stuff',
          versions: [],
          type: 'feat',
          subtype: '',
          subjectType: 'cool stuff'
        },
        {
          short: '102e82e',
          hash: '102e82e10733cbd6ec2a4f7c2424b698a9d58db8',
          date: '2022-12-12T06:19:07.000Z',
          mail: 'c@foo.bar',
          subject: 'feat!: cool stuff that breaks',
          versions: [],
          type: 'BREAKING CHANGE',
          subtype: '',
          subjectType: 'cool stuff that breaks'
        },
        {
          short: '102e82e',
          hash: '102e82e10733cbd6ec2a4f7c2424b698a9d58db8',
          date: '2022-12-12T06:19:07.000Z',
          mail: 'c@foo.bar',
          subject: 'feat!: cool stuff that breaks',
          versions: [],
          type: 'feat',
          subtype: '',
          subjectType: 'cool stuff that breaks'
        },
        {
          short: 'c478182',
          hash: 'c4781824a50bcbcd3da1bf0b5ede267551d8b7bd',
          date: '2022-12-13T06:19:07.000Z',
          mail: 'b@foo.bar',
          subject: 'break: better ingredients',
          versions: [],
          type: 'BREAKING CHANGE',
          subtype: '',
          subjectType: 'better ingredients'
        },
        {
          short: 'f145db0',
          hash: 'f145db0f5e8a4b75b4fcccd6b63af5c5c478182f',
          date: '2022-12-13T06:19:07.000Z',
          mail: 'b@foo.bar',
          subject: 'BREAKING CHANGE: much better ingredients',
          versions: [],
          type: 'BREAKING CHANGE',
          subtype: '',
          subjectType: 'much better ingredients'
        },
        {
          short: '4e8e11e',
          hash: '4e8e11ef5e8a4b75b4fcccd6b63af5c5c478182f',
          tags: ['sometag'],
          date: '2022-12-13T06:19:07.000Z',
          mail: 'b@foo.bar',
          subject: 'wip:',
          versions: [],
          type: 'wip',
          subtype: '',
          subjectType: ''
        },
        {
          short: 'b8e1e26',
          hash: 'b8e1e2694e8e11ef5e8a4b75b4fcccd6b63af5c5',
          date: '2022-12-13T06:19:07.000Z',
          mail: 'b@foo.bar',
          subject: '',
          versions: [],
          type: '',
          subtype: '',
          subjectType: ''
        },
        {
          short: '24e9be9',
          hash: '24e9be9cb8e1e2694e8e11ef5e8a4b75b4fcccd6',
          date: '2022-12-13T06:19:07.000Z',
          mail: 'b@foo.bar',
          subject: 'initial',
          versions: [],
          type: '',
          subtype: '',
          subjectType: ''
        }
      ])
    })

    it('shall parse raw lines', function () {
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
