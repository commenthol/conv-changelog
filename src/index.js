import { Changelog } from './changelog.js'
import debug from 'debug'

const log = debug('conv-changelog:index')

/**
 * @typedef {import('./changelog').SpawnOptionsWithoutStdio} SpawnOptionsWithoutStdio
 * @typedef {import('./changelog').GetLogsOptions} GetLogsOptions
 * @typedef {import('./changelog').FormatOptions} FormatOptions
 */

/**
 * @param {SpawnOptionsWithoutStdio & GetLogsOptions & FormatOptions} options
 * @param {string} [currVersion]
 * @returns {Promise<{
 *  changes: string[]
 *  lastVersion?: string
 *  nextVersion: string
 * }>}
 */
export async function changelog (options, currVersion) {
  const cl = new Changelog(options)
  await cl.getLogs(options)
  const nextVersion = cl.nextVersion(currVersion)
  const lastVersion = cl.lastVersion()
  log({ nextVersion, lastVersion, options })
  const changes = cl.format({ nextVersion, ...options })
  return { changes, lastVersion, nextVersion }
}
