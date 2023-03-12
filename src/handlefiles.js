import { PckgJson } from './pckgjson.js'
import { ChangelogFile } from './changelogfile.js'
import { VersionFile } from './versionfile.js'

/**
 * @typedef {import('./changelogfile').FileHandleOptions} FileHandleOptions
 */

/**
 * @param {FileHandleOptions} options
 * @param {{
 *  changes: string[]
 *  lastVersion?: string
 *  nextVersion: string
 * }} param1
 * @returns {Promise<void>}
 */
export async function handleFiles (options, { changes, lastVersion, nextVersion }) {
  const pckgJson = new PckgJson({ cwd: options.cwd })
  await pckgJson.read()
  const versionFile = new VersionFile({ cwd: options.cwd })
  await versionFile.read()

  // apply changes to package.json if exists
  if (pckgJson.exists()) {
    pckgJson.setNextVersion(nextVersion)
    await pckgJson.write()
  } else {
    versionFile.setNextVersion(nextVersion)
    await versionFile.write()
  }

  // apply changes to changelog file
  const file = new ChangelogFile(options)
  await file.read()
  file.applyChange({ changes, lastVersion })
  await file.write()
}
