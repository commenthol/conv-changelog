import * as fsp from 'node:fs/promises'
import * as path from 'node:path'
import { incVersion, isValidVersion } from './version.js'

export class VersionFile {
  /**
   * @param {object} [options]
   * @param {string} [options.cwd] current working directory
   */
  constructor (options) {
    const {
      cwd = process.cwd()
    } = options || {}
    this._filename = path.resolve(cwd, 'VERSION')
    this._isLoaded = false
  }

  /**
   * @returns {string}
   */
  get version () {
    return this._version || ''
  }

  /**
   * @param {string} nextVersion
   */
  set version (nextVersion) {
    if (isValidVersion(nextVersion)) {
      this._version = nextVersion
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
      const [first] = content.split(/\n/)
      this._version = first
      this._isLoaded = true
    } catch (e) {}
  }

  async write () {
    if (!this._isLoaded) {
      return
    }
    await fsp.writeFile(this._filename, this._version || '', 'utf-8')
  }
}
