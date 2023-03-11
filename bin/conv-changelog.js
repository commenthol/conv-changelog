#!/usr/bin/env node
import { main } from '../src/cli.js'
import debug from 'debug'

const log = debug('conv-changelog:bin')

main().catch(err => {
  log(err)
  console.error(err.message)
})
