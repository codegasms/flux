import { spawn } from 'node:child_process';
import { lstat, mkdtemp } from 'node:fs/promises';
import path from 'node:path';

/**
 * Create a tar archive from a directory.
 */
export async function createTar(sourceFile: string, destinationFile: string): Promise<void> {
    return new Promise(async (resolve, reject) => {

        try {
            const stat = await lstat(sourceFile);
            if (!stat.isDirectory) {
                reject(new Error(`Directory '${sourceFile}' does not exist`));
            }
        } catch (e) {
            reject(e);
        }

        const cwd = path.dirname(sourceFile);
        destinationFile = path.resolve(path.normalize(destinationFile));

        const proc = spawn(
            'tar',
            ['-cvf', destinationFile, sourceFile]
        );

        proc.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Failed to create tar archive. Exit code: ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Extract the contents of a tar archive.
 */
export async function extractTar(sourceFile: string): Promise<void> {
    return new Promise(async (resolve, reject) => {

        try {
            const stat = await lstat(sourceFile);
            if (!stat.isDirectory) {
                reject(new Error(`Directory '${sourceFile}' does not exist`));
            }
        } catch (e) {
            reject(e);
        }

        const proc = spawn(
            'tar',
            ['-xvf', sourceFile]
        );

        proc.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Failed to extract tar archive. Exit code: ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Create a gzip archive from a directory.
 */
export async function createGzip(sourceFile: string, destinationFile: string): Promise<void> {
    return new Promise(async (resolve, reject) => {

        try {
            const stat = await lstat(sourceFile);
            if (!stat.isDirectory) {
                reject(new Error(`Directory '${sourceFile}' does not exist`));
            }
        } catch (e) {
            reject(e);
        }

        const cwd = path.dirname(sourceFile);
        destinationFile = path.resolve(path.normalize(destinationFile));

        const proc = spawn(
            'tar',
            ['-czvf', destinationFile, sourceFile]
        );

        proc.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Failed to create gzip archive. Exit code: ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Extract the contents of a gzip archive.
 */
export async function extractGzip(sourceFile: string): Promise<void> {
    return new Promise(async (resolve, reject) => {

        try {
            const stat = await lstat(sourceFile);
            if (!stat.isDirectory) {
                reject(new Error(`Directory '${sourceFile}' does not exist`));
            }
        } catch (e) {
            reject(e);
        }

        const proc = spawn(
            'tar',
            ['-xzvf', sourceFile]
        );

        proc.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Failed to extract gzip archive. Exit code: ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Create a bzip2 archive from a directory.
 */
export async function createBzip2(sourceFile: string, destinationFile: string): Promise<void> {
    return new Promise(async (resolve, reject) => {

        try {
            const stat = await lstat(sourceFile);
            if (!stat.isDirectory) {
                reject(new Error(`Directory '${sourceFile}' does not exist`));
            }
        } catch (e) {
            reject(e);
        }

        const cwd = path.dirname(sourceFile);
        destinationFile = path.resolve(path.normalize(destinationFile));

        const proc = spawn(
            'tar',
            ['-cjvf', destinationFile, sourceFile]
        );

        proc.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Failed to create bzip2 archive. Exit code: ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Extract the contents of a bzip2 archive.
 */
export async function extractBzip2(sourceFile: string): Promise<void> {
    return new Promise(async (resolve, reject) => {

        try {
            const stat = await lstat(sourceFile);
            if (!stat.isDirectory) {
                reject(new Error(`Directory '${sourceFile}' does not exist`));
            }
        } catch (e) {
            reject(e);
        }

        const proc = spawn(
            'tar',
            ['-xjvf', sourceFile]
        );

        proc.on('exit', (code) => {
            if (code !== 0) {
                reject(
                    new Error(`Failed to extract bzip2 archive. Exit code: ${code}`),
                );
            }
            resolve(undefined);
        });
    });
}

/**
 * Create a rar archive from a directory recursively.
 */
export async function createRar(sourceFile: string, destinationFile: string): Promise<void> {
    return new Promise(async (resolve, reject) => {

        try {
            const stat = await lstat(sourceFile);
            if (!stat.isDirectory) {
                reject(new Error(`Directory '${sourceFile}' does not exist`));
            }
        } catch (e) {
            reject(e);
        }

        const cwd = path.dirname(sourceFile);
        destinationFile = path.resolve(path.normalize(destinationFile));

        const proc = spawn(
            'rar',
            ['a', '-r', destinationFile, sourceFile]
        );

        proc.on('exit', (code) => {
            if (code !== 0) {
                reject(
                    new Error(
                        `Failed to create rar archive from directory. Exit code: ${code}`,
                    ),
                );
            }
            resolve(undefined);
        });
    });
}

/**
 * Extract the contents of a rar archive.
 */
export async function extractRar(sourceFile: string, destinationFile: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const stat = await lstat(sourceFile);
            if (!stat.isFile) {
                reject(new Error(`File '${sourceFile}' does not exist`));
            }
        } catch (e) {
            reject(e);
        }

        const proc = spawn(
            'unrar',
            ['x', sourceFile, destinationFile]
        );

        proc.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Failed to extract rar archive. Exit code: ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Create a zip archive from a directory recursively.
 */
export async function createZip(sourceFile: string, destinationFile: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const stat = await lstat(sourceFile);
            if (!stat.isFile) {
                reject(new Error(`File '${sourceFile}' does not exist`));
            }
        } catch (e) {
            reject(e);
        }

        const cwd = path.dirname(sourceFile);
        destinationFile = path.resolve(path.normalize(destinationFile));

        const proc = spawn(
            'zip',
            ['-r', destinationFile, sourceFile]
        );

        proc.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Failed to create zip archive from directory. Exit code: ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Extract the contents of a zip archive.
 */
export async function extractZip(sourceFile: string, destinationFile: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const stat = await lstat(sourceFile);
            if (!stat.isFile) {
                reject(new Error(`File '${sourceFile}' does not exist`));
            }
        } catch (e) {
            reject(e);
        }

        const cwd = path.dirname(sourceFile);
        destinationFile = path.resolve(path.normalize(destinationFile));

        const proc = spawn(
            'unzip',
            [sourceFile, '-d', destinationFile]
        );

        proc.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Failed to extract zip archive. Exit code: ${code}`));
            }
            resolve(undefined);
        });
    });
}