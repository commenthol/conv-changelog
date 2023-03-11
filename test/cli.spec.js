import assert from 'node:assert'
import { cli } from '../src/cli.js'

describe('cli', function () {
  it('input with same output', function () {
    assert.deepEqual(
      cli(['-i', 'CHANGELOG.md', '-o']),
      {
        in: 'CHANGELOG.md',
        out: 'CHANGELOG.md',
        revisions: 1
      }
    )
  })

  it('input with same output but bad option', function () {
    assert.deepEqual(
      cli(['-i', 'CHANGELOG.md', '-o', '--bad-opt']),
      {
        error: 'unknown option "--bad-opt"',
        in: 'CHANGELOG.md',
        out: true,
        revisions: 1
      }
    )
  })

  it('filter regex', function () {
    assert.deepEqual(
      cli(['--filter', '^Merge|\\bchangelog\\b']),
      {
        in: 'CHANGELOG.md',
        filter: /^Merge|\bchangelog\b/,
        revisions: 1
      }
    )
  })

  it('from .. to', function () {
    assert.deepEqual(
      cli(['--from', 'foo', '--to', 'HEAD']),
      {
        in: 'CHANGELOG.md',
        fromTag: 'foo',
        toTag: 'HEAD',
        revisions: 1
      }
    )
  })

  it('invalid url', function () {
    assert.deepEqual(
      cli(['-u', 'http//foo.bar']),
      {
        in: 'CHANGELOG.md',
        error: '--url http//foo.bar invalid url',
        url: 'http//foo.bar',
        revisions: 1
      }
    )
  })

  it('valid url', function () {
    assert.deepEqual(
      cli(['-u', 'https://www.foo.bar/repo']),
      {
        in: 'CHANGELOG.md',
        url: 'https://www.foo.bar/repo',
        revisions: 1
      }
    )
  })
})
