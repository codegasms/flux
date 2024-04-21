import { spawn } from 'node:child_process';
import { lstat } from 'node:fs/promises';
import path from 'node:path';

/**
 * Convert a markdown file into a PDF.
 */
export async function markdownToPdf(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
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
      'pandoc',
      ['-V', 'geometry:margin=1.5in', sourceFile, '-o', destinationFile],
      { cwd, stdio: 'pipe' }
    );

    proc.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Pandoc failed with exit code ${code}`));
      }
      resolve(undefined);
    });
  });
}

/**
 * Convert an image file in formats like GIF, PNG, TIFF, JPG, WEBP into a PDF.
 */
export async function imageToPdf(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
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
