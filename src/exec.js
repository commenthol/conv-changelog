import { spawn } from 'child_process'
import debug from 'debug'

const log = debug('conv-changelog:exec')

/**
 * buffered spawn for stdio and stderr
 * @param {string} command
 * @param {import('child_process').SpawnOptionsWithoutStdio} opts see https://nodejs.org/dist/latest/docs/api/child_process.html#child_processspawncommand-args-options
 * @returns {Promise<Buffer>}
 */
export function exec (command, opts = {}) {
  const [cmd, ...args] = command.split(/\s+/)

  log(cmd, args, opts)

  let stdout = Buffer.from('')
  let stderr = Buffer.from('')

  return new Promise((resolve, reject) => {
    const sub = spawn(cmd, args, opts)

    const handleError = err => {
      // @ts-ignore
      err.stderr = stderr.toString()
      reject(err)
    }

    sub.stdout.on('data', data => { stdout = Buffer.concat([stdout, data]) })
    sub.stdout.on('error', handleError)
    sub.stderr.on('data', data => { stderr = Buffer.concat([stderr, data]) })
    sub.stderr.on('error', handleError)

    sub.on('close', () => resolve(stdout))
    sub.on('error', handleError)
  })
}
