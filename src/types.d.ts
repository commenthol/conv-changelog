import { Semver } from 'semver'

export interface GitLogItem {
  short: string,
  hash: string
  tags?: string[],
  date: Date,
  mail: string,
  subject: string,
  versions?: Semver[],
  type: string,
  subtype: string,
  subjectType: string
}
