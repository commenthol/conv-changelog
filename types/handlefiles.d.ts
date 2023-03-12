/**
 * @typedef {import('./changelogfile').FileHandleOptions} FileHandleOptions
 */
/**
 * @param {FileHandleOptions} options
 * @param {{
 *  changes: string[]
 *  lastVersion?: string
 *  nextVersion: string
 * }} param1
 * @returns {Promise<void>}
 */
export function handleFiles(options: FileHandleOptions, { changes, lastVersion, nextVersion }: {
    changes: string[];
    lastVersion?: string;
    nextVersion: string;
}): Promise<void>;
export type FileHandleOptions = import('./changelogfile').FileHandleOptions;
