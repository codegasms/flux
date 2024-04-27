import { spawn } from 'node:child_process';
import { lstat, mkdtemp } from 'node:fs/promises';
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
 * Convert a text file into a PDF.
 */
export async function textToPdf(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
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
            [sourceFile, '-o', destinationFile],
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

/**
 * Convert a PDF file into image file in formats like GIF, PNG, TIFF, JPG, WEBP.
 */
export async function pdfToImage(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const stat = await lstat(sourceFile);
            if (!stat.isFile) {
                reject(new Error(`File '${sourceFile}' does not exist`));
            }
        } catch (e) {
            reject(e);
        }

        const tempDir = await mkdtemp('flux_mods_');

        const proc1 = spawn(
            'convert',
            ['-density', '300', sourceFile, '-quality', '100', `${tempDir}/image.jpg`],
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
 * Convert a doc file into a PDF.
 */
export async function docToPdf(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
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

        const proc1 = spawn(
            'libreoffice',
            ['--headless', '--convert-to', 'pdf', sourceFile],
            { cwd, stdio: 'pipe' }
        );

        proc1.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`LibreOffice failed with exit code ${code}`));
            }
            resolve(undefined);
        });

        const proc2 = spawn(
            'mv',
            [`${cwd}/${sourceFile.replace(/\.[^/.]+$/, '.pdf')}`, destinationFile],
            { stdio: 'pipe' }
        );

        proc2.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Move failed with exit code ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Convert a PDF file into a doc.
 */
export async function pdfToDoc(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
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

        const proc1 = spawn(
            'libreoffice',
            ['--infilter="writer_pdf_import"', '--convert-to', 'doc', sourceFile],
            { cwd, stdio: 'pipe' }
        );

        proc1.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`LibreOffice failed with exit code ${code}`));
            }
            resolve(undefined);
        });

        const proc2 = spawn(
            'mv',
            [`${cwd}/${sourceFile.replace(/\.[^/.]+$/, '.doc')}`, destinationFile],
            { stdio: 'pipe' }
        );

        proc2.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Move failed with exit code ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Convert a ppt file into a PDF.
 */
export async function pptToPdf(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
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

        const proc1 = spawn(
            'libreoffice',
            ['--headless', '--invisible', '--convert-to', 'pdf', sourceFile],
            { cwd, stdio: 'pipe' }
        );

        proc1.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`LibreOffice failed with exit code ${code}`));
            }
            resolve(undefined);
        });

        const proc2 = spawn(
            'mv',
            [`${cwd}/${sourceFile.replace(/\.[^/.]+$/, '.pdf')}`, destinationFile],
            { stdio: 'pipe' }
        );

        proc2.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Move failed with exit code ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Convert a PDF file into a ppt.
 */
export async function pdfTpPpt(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
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

        const proc1 = spawn(
            'libreoffice',
            ['--infilter="impress_pdf_import"', '--convert-to', 'ppt', sourceFile],
            { cwd, stdio: 'pipe' }
        );

        proc1.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`LibreOffice failed with exit code ${code}`));
            }
            resolve(undefined);
        });

        const proc2 = spawn(
            'mv',
            [`${cwd}/${sourceFile.replace(/\.[^/.]+$/, '.ppt')}`, destinationFile],
            { stdio: 'pipe' }
        );

        proc2.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Move failed with exit code ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Convert a xls file into a PDF.
 */
export async function xlsToPdf(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
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

        const proc1 = spawn(
            'libreoffice',
            ['--headless', '--convert-to', 'pdf:calc_pdf_Export', sourceFile],
            { cwd, stdio: 'pipe' }
        );

        proc1.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`LibreOffice failed with exit code ${code}`));
            }
            resolve(undefined);
        });

        const proc2 = spawn(
            'mv',
            [`${cwd}/${sourceFile.replace(/\.[^/.]+$/, '.pdf')}`, destinationFile],
            { stdio: 'pipe' }
        );

        proc2.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Move failed with exit code ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Convert a xls file into a csv.
 */
export async function xlsToCsv(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
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

        const proc1 = spawn(
            'libreoffice',
            ['--headless', '--convert-to', 'csv', sourceFile],
            { cwd, stdio: 'pipe' }
        );

        proc1.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`LibreOffice failed with exit code ${code}`));
            }
            resolve(undefined);
        });

        const proc2 = spawn(
            'mv',
            [`${cwd}/${sourceFile.replace(/\.[^/.]+$/, '.csv')}`, destinationFile],
            { stdio: 'pipe' }
        );

        proc2.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Move failed with exit code ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Convert a csv file into a xls.
 */
export async function csvToXls(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
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

        const proc1 = spawn(
            'libreoffice',
            ['--headless', '--convert-to', 'xls', sourceFile],
            { cwd, stdio: 'pipe' }
        );

        proc1.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`LibreOffice failed with exit code ${code}`));
            }
            resolve(undefined);
        });

        const proc2 = spawn(
            'mv',
            [`${cwd}/${sourceFile.replace(/\.[^/.]+$/, '.xls')}`, destinationFile],
            { stdio: 'pipe' }
        );

        proc2.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Move failed with exit code ${code}`));
            }
            resolve(undefined);
        });
    });
}

/**
 * Convert a xls file into a xml.
 */
export async function xlsToXml(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
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

        const proc1 = spawn(
            'libreoffice',
            ['--headless', '--convert-to', 'xml', sourceFile],
            { cwd, stdio: 'pipe' }
        );

        proc1.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`LibreOffice failed with exit code ${code}`));
            }
            resolve(undefined);
        });

        const proc2 = spawn(
            'mv',
            [`${cwd}/${sourceFile.replace(/\.[^/.]+$/, '.xml')}`, destinationFile],
            { stdio: 'pipe' }
        );

        proc2.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Move failed with exit code ${code}`));
            }
            resolve(undefined);
        });
    });
}


/**
 * Convert a xml file into a xls.
 */
export async function xmlToXls(sourceFile: string, destinationFile: string, _args?: any): Promise<void> {
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

        const proc1 = spawn(
            'libreoffice',
            ['--headless', '--convert-to', 'xls', sourceFile],
            { cwd, stdio: 'pipe' }
        );

        proc1.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`LibreOffice failed with exit code ${code}`));
            }
            resolve(undefined);
        });

        const proc2 = spawn(
            'mv',
            [`${cwd}/${sourceFile.replace(/\.[^/.]+$/, '.xls')}`, destinationFile],
            { stdio: 'pipe' }
        );

        proc2.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Move failed with exit code ${code}`));
            }
            resolve(undefined);
        });
    });
}
