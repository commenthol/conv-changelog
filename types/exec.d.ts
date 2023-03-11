/**
 * buffered spawn for stdio and stderr
 * @param {string} command
 * @param {import('child_process').SpawnOptionsWithoutStdio} opts see https://nodejs.org/dist/latest/docs/api/child_process.html#child_processspawncommand-args-options
 * @returns {Promise<Buffer>}
 */
export function exec(command: string, opts?: import('child_process').SpawnOptionsWithoutStdio): Promise<Buffer>;
