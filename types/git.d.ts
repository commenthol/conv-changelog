/// <reference types="node" />
export class Git {
    /**
     * @param {string[]} lines
     * @param {string} [sep]
     * @returns {GitLogItem[]|[]}
     */
    static parseLines(lines: string[], sep?: string | undefined): GitLogItem[] | [];
    /**
     * @param {import('node:child_process').SpawnOptionsWithoutStdio} [options]
     */
    constructor(options?: import("child_process").SpawnOptionsWithoutStdio | undefined);
    /**
     * @param {string} [fromTag]
     * @param {string} [toTag='HEAD']
     * @returns {Promise<GitLogItem[]|[]>}
     */
    getLog(fromTag?: string | undefined, toTag?: string | undefined): Promise<GitLogItem[] | []>;
    #private;
}
export type GitLogItem = import('../src/types').GitLogItem;
