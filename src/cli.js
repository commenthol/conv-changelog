import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { changelog } from './index.js'
import { help } from './help.js'
import debug from 'debug'
import { ChangelogFile } from './changelogfile.js'
import { PckgJson } from './pckgjson.js'
import { VersionFile } from './versionfile.js'

const log = debug('conv-changelog:cli')

const readJsonSync = (filename) =>
  JSON.parse(fs.readFileSync(new URL(filename, import.meta.url), 'utf-8'))

const startsWithDash = (str) => str && str[0] === '-'

const isInteger = (num) => Number.isSafeInteger(Number(num))

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export function cli (argv = process.argv.slice(2)) {
  const o = {
    in: 'CHANGELOG.md',
    revisions: 1
  }

  while (argv.length) {
    const arg = argv.shift()

    switch (arg) {
      case '-?':
      case '-h':
      case '--help': {
        o.help = true
        break
      }
      case '-v':
      case '--version': {
        o.version = readJsonSync('../package.json').version
        break
      }
      case '-i':
      case '--in': {
        const arg = argv.shift()
        if (!arg || startsWithDash(arg)) {
          o.error = `--in ${arg} must be a valid filename`
        }
        o.in = arg
        break
      }
      case '-o':
      case '--out': {
        const arg = argv.shift()
        if (arg && startsWithDash(arg)) {
          argv.unshift(arg)
          o.out = true
        } else {
          o.out = arg || true
        }
        break
      }
      case '-d':
      case '--dir': {
        const arg = argv.shift()
        if (!arg || startsWithDash(arg)) {
          o.error = `--dir ${arg} must be a directory`
          break
        }
        o.cwd = path.resolve(__dirname, '..', arg)
        break
      }
      case '-r':
      case '--revision': {
        const arg = argv.shift()
        if (!isInteger(arg)) {
          o.error = `--revision "${arg}" needs to be a number`
        }
        o.revisions = Number(arg)
        break
      }
      case '-f':
      case '--from': {
        const arg = argv.shift()
        if (!arg || startsWithDash(arg)) {
          o.error = `--from ${arg} must be a valid tag`
        }
        o.fromTag = arg
        break
      }
      case '-t':
      case '--to': {
        const arg = argv.shift()
        if (!arg || startsWithDash(arg)) {
          o.error = `--to ${arg} must be a valid tag`
          break
        }
        o.toTag = arg
        break
      }
      case '--filter': {
        const arg = argv.shift()
        if (!arg || startsWithDash(arg)) {
          o.error = `--filter ${arg} invalid argument`
          break
        }
        o.filter = new RegExp(arg)
        break
      }
      case '-th':
      case '--theme': {
        const arg = argv.shift()
        if (!arg || startsWithDash(arg)) {
          o.error = `--type ${arg} invalid argument`
          break
        }
        o.theme = arg
        break
      }
      case '-u':
      case '--url': {
        const arg = argv.shift()
        if (!arg || startsWithDash(arg) || !/^https?:[/][/][a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test(arg)) {
          o.error = `--url ${arg} invalid url`
        }
        o.url = arg
        break
      }
      case '--no-hash': {
        o.useHash = false
        break
      }
      default: {
        if (startsWithDash(arg)) {
          o.error = `unknown option "${arg}"`
          return o
        }
        o._packages.push(arg)
        break
      }
    }

    if (o.error) {
      return o
    }
  }

  if (o.out === true) {
    o.out = o.in
  }

  return o
}

export async function main () {
  const options = cli()

  options.cwd = options.cwd || process.cwd()

  log(options)

  if (options.version) {
    console.log(options.version)
    return
  }
  if (options.help) {
    console.log(help())
    return
  }
  if (options.error) {
    console.error('ERROR: %s', options.error)
    process.exit(1)
  }

  const { changes, lastVersion, nextVersion } = await changelog(options)

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

  if (!options.out) {
    console.log(changes.join(''))
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main().catch(console.error)
}
