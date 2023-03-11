import ejs from 'ejs'

// (version, lastVersion, date, url, lines) => string
const linesT = ejs.compile(
  `# <%-version%> (<%-date%>)

<%_ lines.forEach(({subject, short}) => { _%>
- <%-subject%><% if (useHash) { %> (<%-short%>)<% } %>
<%_ }) _%>

`
)

const linesUrlT = ejs.compile(
  `# [<%-version%>](<%-url%>/<%-lastVersion%>..<%-version%>) (<%-date%>)

<%_ lines.forEach(({subject, short, hash}) => { _%>
- <%-subject%><% if (useHash) { %> [<%-short%>](<%-url%>/<%-hash%>)<% } %>
<%_ }) _%>

`)

// (version, lastVersion, date, groups: {name, lines}) => string
const groupsT = ejs.compile(
  `# <%-version%> (<%-date%>)
<%_ groups.forEach(({type, lines}) => { _%>

### <%-type%>:

<%_ lines.forEach(({subject, short}) => { _%>
- <%-subject%><% if (useHash) { %> (<%-short%>)<% } %>
<%_ }) _%>
<%_ }) _%>

`
)

// (version, lastVersion, date, url, groups: {name, lines}) => string
const groupsUrlT = ejs.compile(
  `# [<%-version%>](<%-url%>/<%-lastVersion%>..<%-version%>) (<%-date%>)
<%_ groups.forEach(({type, lines}) => { _%>

### <%-type%>:

<%_ lines.forEach(({short, hash, subject}) => { _%>
- <%-subject%><% if (useHash) { %> [<%-short%>](<%-url%>/<%-hash%>)<% } %>
<%_ }) _%>
<%_ }) _%>

`)

export function formatLines (items, { lastVersion = '0.0.0', nextVersion = '', url = '', useHash = true } = {}) {
  const out = []

  let lines = []
  let date = new Date()
  let version = nextVersion

  const pushIt = () => {
    const _date = date.toISOString().slice(0, 10)
    const template = url && lastVersion ? linesUrlT : linesT
    const str = template({ useHash, version, lastVersion, date: _date, url, lines })
    out.push(str)
  }

  for (const item of items) {
    if (item.versions?.length) {
      lastVersion = item.versions[0].version
      pushIt()
      lines = []
      version = lastVersion
      date = item.date
    } else {
      lines.push(item)
    }
  }

  if (lines.length) {
    pushIt()
  }

  return out
}

export function formatByGroups (items, { lastVersion = '0.0.0', nextVersion = '', url = '', useHash = true } = {}) {
  const out = []

  let groups = {}
  let date = new Date()
  let version = nextVersion

  const pushIt = () => {
    const groupsArr = sortBy(
      Object.keys(groups),
      ['BREAKING CHANGE', 'break', 'feat', 'fix', 'docs', 'chore']
    )
      .map((type) => groups[type])
    const _date = date.toISOString().slice(0, 10)
    const template = url && lastVersion ? groupsUrlT : groupsT
    const str = template({
      useHash,
      version,
      lastVersion,
      date: _date,
      url,
      groups: groupsArr
    })
    out.push(str)
  }

  for (const item of items) {
    const type = item?.type || 'other'
    if (item.versions?.length) {
      lastVersion = item.versions[0].version
      pushIt()
      groups = {}
      version = lastVersion
      date = item.date
    } else {
      groups[type] = groups[type] || { type, lines: [] }
      const subject = item.subtype
        ? `${item.subtype}: ${item.subjectType}`
        : item.subjectType || item.subject
      groups[type].lines.push({ ...item, subject })
    }
  }

  if (Object.keys(groups).length) {
    pushIt()
  }

  return out
}

/**
 * sort strings, numbers, booleans
 * @private
 * @param {any} a
 * @param {any} b
 * @returns {number}
 */
const sort = (a, b) => typeof a === 'string'
  ? a.localeCompare(b)
  : a - b

/**
 * @param {object[]} arrOfObjs
 * @param {string|string[]} keys
 * @returns {object[]} sorted array of objects
 */
export const sortBy = (arrOfObjs, keys) => {
  const _keys = typeof keys === 'string' ? [keys] : keys
  const sorter = (a, b) => {
    for (const key of _keys) {
      const r = sort(a[key], b[key])
      if (r !== 0) return r
    }
    return 0
  }
  return arrOfObjs.sort(sorter)
}
