import { exec } from './exec.js'
import semver from 'semver'
import debug from 'debug'

const log = debug('conv-changelog:git')

/**
 * @typedef {import('../src/types').GitLogItem} GitLogItem
 */

const randomSep = () => `(~(${Math.random().toString(36)})~)`

const SEP = randomSep()
const LINESEP = randomSep()

// @see https://git-scm.com/docs/pretty-formats
// [short, hash, tags, date, mail, subject]
const FORMAT = ['%h', '%H', '%d', '%ci', '%ce', '%s', '%b', LINESEP].join(SEP)

export class Git {
  #options

  /**
   * @param {import('node:child_process').SpawnOptionsWithoutStdio} [options]
   */
  constructor (options) {
    this.#options = {
      windowsHide: true,
      ...options
    }
  }

  /**
   * @param {string[]} lines
   * @param {string} [sep]
   * @returns {GitLogItem[]|[]}
   */
  static parseLines (lines, sep = SEP) {
    const out = []
    for (const line of lines) {
      const [short, hash, _tags, date, mail = '', subject = '', body = ''] = line.split(sep)
      if (!short) continue
      const tags = _tags?.length
        ? _tags
          .replace(/^\s*\(/, '')
          .replace(/\)\s*$/, '')
          .split(',')
          .filter(Boolean)
          .map((item) => item.replace('tag: ', '').trim())
        : undefined

      // @ts-expect-error
      const versions = [...new Set([].concat(subject, tags))]
        .map((item) => semver.parse(item || ''))
        .filter(Boolean)

      // eslint-disable-next-line no-unused-vars
      const [_, type = '', subtype = '', isBreaking, subjectType = ''] =
        /^([^:!\s(]+|BREAKING CHANGE)(?:\(([^)]+)\)|)?(!|):\s*(.*)$/.exec(subject) || []

      const isBreakingType = ['break', 'BREAKING CHANGE'].includes(type)
      const isBreakingFooter = /\bBREAKING CHANGE\b/.test(body)

      if (isBreaking || isBreakingType || isBreakingFooter) {
        let _subject = subject
        let _subjectType = subjectType
        if (isBreakingFooter) {
          const [line, subjectType] = /^.*\bBREAKING CHANGE[:\s]\s*([^\n]+).*$/m.exec(body) || []
          if (line) {
            _subject = line.trim()
            _subjectType = subjectType.trim()
          }
        }
        out.push({
          short,
          hash,
          tags,
          date: new Date(date),
          mail,
          subject: _subject,
          versions,
          type: 'BREAKING CHANGE',
          subtype,
          subjectType: _subjectType
        })
      }
      if (!isBreakingType) {
        out.push({
          short,
          hash,
          tags,
          date: new Date(date),
          mail,
          subject,
          versions,
          type: type.toLowerCase(),
          subtype,
          subjectType
        })
      }
    }
    log(out)
    return out
  }

  /**
   * @param {string} [fromTag]
   * @param {string} [toTag='HEAD']
   * @returns {Promise<GitLogItem[]|[]>}
   */
  async getLog (fromTag, toTag = 'HEAD') {
    const opts = fromTag ? `${fromTagAddPrevious(fromTag)}..${toTag}` : ''
    const cmd = `git log ${opts} --pretty=format:${FORMAT}`
    const stdout = await exec(cmd, this.#options)
    const lines = stdout.toString().split(LINESEP + '\n')
    return Git.parseLines(lines)
  }
}

const fromTagAddPrevious = (fromTag) => {
  if (fromTag.indexOf('~') > 0) {
    return fromTag
  }
  return `${fromTag}~1`
}
