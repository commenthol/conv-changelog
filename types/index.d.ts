/**
 * @typedef {import('./changelog').SpawnOptionsWithoutStdio} SpawnOptionsWithoutStdio
 * @typedef {import('./changelog').GetLogsOptions} GetLogsOptions
 * @typedef {import('./changelog').FormatOptions} FormatOptions
 */
/**
 * @param {SpawnOptionsWithoutStdio & GetLogsOptions & FormatOptions} options
 * @param {string} [currVersion]
 * @returns {Promise<{
 *  changes: string[]
 *  lastVersion?: string
 *  nextVersion: string
 * }>}
 */
export function changelog(options: SpawnOptionsWithoutStdio & GetLogsOptions & FormatOptions, currVersion?: string | undefined): Promise<{
    changes: string[];
    lastVersion?: string | undefined;
    nextVersion: string;
}>;
export type SpawnOptionsWithoutStdio = import('./changelog').SpawnOptionsWithoutStdio;
export type GetLogsOptions = import('./changelog').GetLogsOptions;
export type FormatOptions = import('./changelog').FormatOptions;
