/// <reference types="node" />
/**
 * @typedef {import('node:child_process').SpawnOptionsWithoutStdio} SpawnOptionsWithoutStdio
 */
export class ChangelogFile {
    /**
     * @param {SpawnOptionsWithoutStdio & {in?: string, out?: string}} [options]
     */
    constructor(options?: (import("child_process").SpawnOptionsWithoutStdio & {
        in?: string | undefined;
        out?: string | undefined;
    }) | undefined);
    _content: string;
    _isLoaded: boolean;
    _dirname: string;
    _inFilename: string;
    _outFilename: string | undefined;
    read(): Promise<void>;
    write(): Promise<void>;
    applyChange({ changes, lastVersion }: {
        changes: any;
        lastVersion: any;
    }): void;
}
export type SpawnOptionsWithoutStdio = import('node:child_process').SpawnOptionsWithoutStdio;
