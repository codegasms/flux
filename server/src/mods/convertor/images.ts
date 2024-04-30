import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';

/**
 * Convert a Image format into another Image format.
 */
export async function imageToImage(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const proc = spawn(
            'convert',
            [sourceFile, '-quality', '100', destinationFile],
            { stdio: 'pipe' }
        );

        proc.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`ImageMagick failed with exit code ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Convert a GIF file into png file.
 */
export async function gifToPng(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const tempDir = await mkdtemp('flux_mods_');

        const proc1 = spawn(
            'convert',
            [sourceFile, '-quality', '100', `${tempDir}/image.png`],
            { stdio: 'pipe' }
        );

        proc1.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`ImageMagick failed with exit code ${code}`));
            }
            resolve(undefined);
        });

        const proc2 = spawn(
            'zip',
            ['-r', destinationFile, tempDir],
            { stdio: 'pipe' }
        );

        proc2.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Zip failed with exit code ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Convert a png file into GIF.
 */
export async function pngToGif(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const tempDir = await mkdtemp('flux_mods_');

        const proc1 = spawn(
            'unzip',
            [destinationFile, '-d', tempDir],
            { stdio: 'pipe' }
        );

        proc1.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Unzip failed with exit code ${code}`));
            }
            resolve(undefined);
        });

        const proc2 = spawn(
            'convert',
            ['-delay', '0', '-loop', '0', `${tempDir}/*.png`, destinationFile],
            { stdio: 'pipe' }
        );

        proc2.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`ImageMagick failed with exit code ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Show the metadata of the Image.
 */
export async function showMetadata(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const proc = spawn(
            'exiftool',
            [sourceFile, '>', destinationFile],
            { stdio: 'pipe' }
        );

        proc.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Exiftool failed with exit code ${code}`));
            }
            resolve(undefined);
        });
    });
}
