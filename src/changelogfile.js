import * as path from 'node:path'
import * as fsp from 'node:fs/promises'
import debug from 'debug'

const log = debug('conv-changelog:clfile')

/**
 * @typedef {object} FileHandleOptions
 * @property {string} cwd Current working directory
 * @property {string} [in='CHANGELOG.md'] input file
 * @property {string} [out] output file
 */

export class ChangelogFile {
  /**
   * @param {FileHandleOptions} [options]
   */
  constructor (options) {
    const {
      cwd = process.cwd(),
      in: inFilename = 'CHANGELOG.md',
      out: outFilename
    } = options || {}

    this._content = ''
    this._isLoaded = false
    this._dirname = String(cwd || '')

    this._inFilename = path.resolve(this._dirname, inFilename)
    this._outFilename = outFilename && path.resolve(this._dirname, outFilename)
  }

  async read () {
    try {
      this._content = await fsp.readFile(this._inFilename, 'utf-8')
    } catch (e) {
      // suppress error as file might not yet exists
    }
    this._isLoaded = true
  }

  async write () {
    if (!this._outFilename || !this._content) {
      return
    }
    if (!this._isLoaded) {
      throw new Error('load file before writing')
    }
    await fsp.writeFile(this._outFilename, this._content, 'utf-8')
  }

  applyChange ({ changes, lastVersion }) {
    if (!this._isLoaded) {
      throw new Error('load file before any change')
    }

    if (!changes.length) {
      log('no changes...')
      return
    }

    const content = this._content?.split(/(#+ .*)/)

    if (!content || !lastVersion) {
      this._content = changes
      return
    }

    let slicePos
    // iterate over content and find line which contains lastVersion
    for (let i = 0; i < content.length; i++) {
      const line = content[i]
      const pos = line.indexOf(lastVersion)
      if (line.startsWith('#') && pos > 0 && pos < 7) {
        slicePos = i
        break
      }
    }

    const lower = content.slice(slicePos)
    // @ts-expect-error
    this._content = [].concat(changes, lower).join('')
  }
}
