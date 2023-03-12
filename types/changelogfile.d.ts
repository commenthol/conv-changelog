/**
 * @typedef {object} FileHandleOptions
 * @property {string} cwd Current working directory
 * @property {string} [in='CHANGELOG.md'] input file
 * @property {string} [out] output file
 */
export class ChangelogFile {
    /**
     * @param {FileHandleOptions} [options]
     */
    constructor(options?: FileHandleOptions | undefined);
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
export type FileHandleOptions = {
    /**
     * Current working directory
     */
    cwd: string;
    /**
     * input file
     */
    in?: string | undefined;
    /**
     * output file
     */
    out?: string | undefined;
};
