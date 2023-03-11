import * as fsp from 'node:fs/promises'
import * as path from 'node:path'
import { incVersion, isValidVersion } from './version.js'

export class PckgJson {
  /**
   * @param {object} [options]
   * @param {string} [options.cwd] current working directory
   */
  constructor (options) {
    const {
      cwd = process.cwd()
    } = options || {}
    this._filename = path.resolve(cwd, 'package.json')
    this._isLoaded = false
    this._content = {}
  }

  /**
   * @returns {string}
   */
  get version () {
    return this._content.version || ''
  }

  /**
   * @param {string} nextVersion
   */
  set version (nextVersion) {
    if (isValidVersion(nextVersion)) {
      this._content.version = nextVersion
    }
  }

  exists () {
    return this._isLoaded
  }

  setNextVersion (nextVersion) {
    this.version = incVersion(this.version, nextVersion)
  }

  async read () {
    try {
      const content = await fsp.readFile(this._filename, 'utf-8')
      this._content = JSON.parse(content)
      this._isLoaded = true
    } catch (e) {}
  }

  async write () {
    if (!this._isLoaded) {
      return
    }
    await fsp.writeFile(
      this._filename,
      JSON.stringify(this._content, null, 2) + '\n',
      'utf-8'
    )
  }
}
