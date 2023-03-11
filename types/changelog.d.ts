/// <reference types="node" />
/**
 * @typedef {import('../src/types').GitLogItem} GitLogItem
 */
/**
 * @typedef {object} GetLogsOptions
 * @property {number} [revisions=1] number of revisions to travel back
 * @property {string} [fromTag] start with tag (disabled lookup by revisions)
 * @property {string} [toTag='HEAD'] end with tag
 * @property {RegExp} [filter=/^Merge pull request|\bchangelog\b/] filter by subject
 */
/**
 * @typedef {object} FormatOptions
 * @property {string} [url]
 * @property {'groups'|'lines'|string} [theme='lines']
 * @property {string} [nextVersion]
 * @property {boolean} [useHash=true]
 */
/**
 * @typedef {import('node:child_process').SpawnOptionsWithoutStdio} SpawnOptionsWithoutStdio
 */
export class Changelog {
    /**
     * @param {SpawnOptionsWithoutStdio} [options]
     */
    constructor(options?: import("child_process").SpawnOptionsWithoutStdio | undefined);
    _git: Git;
    _items: any;
    /**
     * get all version tags from git log
     * @returns {Promise<GitLogItem[]>}
     */
    getVersionTags(): Promise<GitLogItem[]>;
    /**
     * get all version tags from git log
     * @param {GetLogsOptions} [options]
     * @returns {Promise<GitLogItem[]>}
     */
    getLogs(options?: GetLogsOptions | undefined): Promise<GitLogItem[]>;
    /**
     * @param {string} [version] current version (e.g.  from package.json)
     * @returns {string} next found version
     */
    nextVersion(version?: string | undefined): string;
    /**
     * @returns {string|undefined}
     */
    lastVersion(): string | undefined;
    /**
     * @param {FormatOptions} options
     * @returns {string[]}
     */
    format(options: FormatOptions): string[];
}
export type GitLogItem = import('../src/types').GitLogItem;
export type GetLogsOptions = {
    /**
     * number of revisions to travel back
     */
    revisions?: number | undefined;
    /**
     * start with tag (disabled lookup by revisions)
     */
    fromTag?: string | undefined;
    /**
     * end with tag
     */
    toTag?: string | undefined;
    /**
     * filter by subject
     */
    filter?: RegExp | undefined;
};
export type FormatOptions = {
    url?: string | undefined;
    theme?: string | undefined;
    nextVersion?: string | undefined;
    useHash?: boolean | undefined;
};
export type SpawnOptionsWithoutStdio = import('node:child_process').SpawnOptionsWithoutStdio;
import { Git } from "./git.js";
