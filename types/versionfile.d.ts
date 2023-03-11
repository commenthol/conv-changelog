export class VersionFile {
    /**
     * @param {object} [options]
     * @param {string} [options.cwd] current working directory
     */
    constructor(options?: {
        cwd?: string | undefined;
    } | undefined);
    _filename: string;
    _isLoaded: boolean;
    /**
     * @param {string} nextVersion
     */
    set version(arg: string);
    /**
     * @returns {string}
     */
    get version(): string;
    _version: string | undefined;
    exists(): boolean;
    setNextVersion(nextVersion: any): void;
    read(): Promise<void>;
    write(): Promise<void>;
}
