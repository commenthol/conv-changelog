export class PckgJson {
    /**
     * @param {object} [options]
     * @param {string} [options.cwd] current working directory
     */
    constructor(options?: {
        cwd?: string | undefined;
    } | undefined);
    _filename: string;
    _isLoaded: boolean;
    _content: {};
    /**
     * @param {string} nextVersion
     */
    set version(arg: string);
    /**
     * @returns {string}
     */
    get version(): string;
    exists(): boolean;
    setNextVersion(nextVersion: any): void;
    read(): Promise<void>;
    write(): Promise<void>;
}
