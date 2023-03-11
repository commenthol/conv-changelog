import semver from 'semver'
import { Git } from './git.js'
import { formatByGroups, formatLines } from './format.js'

/**
 * @typedef {import('../src/types').GitLogItem} GitLogItem
 */
/**
 * @typedef {object} GetLogsOptions
 * @property {number} [revisions=1] number of revisions to travel back
 * @property {string} [fromTag] start with tag (disabled lookup by revisions)
 * @property {string} [toTag='HEAD'] end with tag
 * @property {RegExp} [filter=/^Merge pull request|\bchangelog\b/] filter by subject
 */
/**
 * @typedef {object} FormatOptions
 * @property {string} [url]
 * @property {'groups'|'lines'|string} [theme='lines']
 * @property {string} [nextVersion]
 * @property {boolean} [useHash=true]
 */
/**
 * @typedef {import('node:child_process').SpawnOptionsWithoutStdio} SpawnOptionsWithoutStdio
 */

export class Changelog {
  _git
  _items

  /**
   * @param {SpawnOptionsWithoutStdio} [options]
   */
  constructor (options) {
    this._git = new Git(options)
  }

  /**
   * get all version tags from git log
   * @returns {Promise<GitLogItem[]>}
   */
  async getVersionTags () {
    const items = await this._git.getLog()
    const tags = []
    for (const item of items) {
      if (item.versions?.length) {
        tags.push(item)
      }
    }
    return tags
  }

  /**
   * get all version tags from git log
   * @param {GetLogsOptions} [options]
   * @returns {Promise<GitLogItem[]>}
   */
  async getLogs (options) {
    const {
      revisions = 1,
      fromTag,
      toTag,
      filter = /^Merge pull request|\bchangelog\b/
    } = options || {}
    let cnt = fromTag ? undefined : revisions

    const items = await this._git.getLog(fromTag, toTag)
    const lines = []
    for (const item of items) {
      // ignore pre-releases
      const isPreRelease = item.versions?.[0]?.prerelease.length

      if (cnt && item.versions?.length && !isPreRelease) {
        cnt--
        if (cnt === 0) {
          // push the last version as well
          lines.push(item)
          break
        }
      }
      if (!isPreRelease && !filter.test(item.subject)) {
        lines.push(item)
      }
    }
    this._items = lines
    return lines
  }

  /**
   * @param {string} [version] current version (e.g.  from package.json)
   * @returns {string} next found version
   */
  nextVersion (version = '0.0.0') {
    let nextType = 'patch'

    const nextVersionInc = (version) => semver.inc(version, nextType)

    for (const item of this._items) {
      const { type } = item
      if (['feat'].includes(type) && nextType !== 'minor') {
        nextType = 'minor'
      } else if (['break', 'BREAKING CHANGE'].includes(type) && nextType !== 'major') {
        nextType = 'major'
      }
      if (item.versions?.length) {
        const nextVersion = nextVersionInc(item.versions[0]?.version)
        return nextVersion
      }
    }

    const nextVersion = nextVersionInc(version)
    return nextVersion
  }

  /**
   * @returns {string|undefined}
   */
  lastVersion () {
    if (!this._items.length) {
      return
    }
    const lastItem = this._items[this._items.length - 1]
    const version = lastItem?.versions?.[0]?.version
    return version
  }

  /**
   * @param {FormatOptions} options
   * @returns {string[]}
   */
  format (options) {
    const {
      nextVersion,
      url,
      theme = 'lines',
      useHash = true
    } = options || {}

    let out
    switch (theme) {
      case 'groups':
        out = formatByGroups(this._items, { nextVersion, url, useHash })
        break
      default:
        out = formatLines(this._items, { nextVersion, url, useHash })
        break
    }

    return out
  }
}
