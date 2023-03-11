import semver from 'semver'

/**
 * @param {string} currVersion
 * @param {string} nextVersion
 * @returns {string}
 */
export function incVersion (currVersion, nextVersion) {
  const curr = semver.parse(currVersion) || {}
  const next = semver.parse(nextVersion)
  const isCurrPrerelease = curr.prerelease?.length
  const isSamePatch = curr.major === next.major &&
    curr.minor === next.minor &&
    curr.patch === next.patch

  if (isCurrPrerelease && isSamePatch) {
    return curr.version
  } else {
    return semver.inc(nextVersion, 'pre')
  }
}

/**
 * @param {string} version
 * @returns {boolean}
 */
export function isValidVersion (version) {
  return semver.valid(version)
}
