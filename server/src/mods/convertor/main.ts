import fs from 'node:fs';
import path from 'path';

import * as documents from './documents';
import * as images from './images';

/*
import {
    markdownToPdf,
    textToPdf,
    imageToPdf,
    pdfToImage,
    docToPdf,
    pdfToDoc,
    pptToPdf,
    pdfTpPpt,
    xlsToPdf,
    xlsToCsv,
    csvToXls,
    xlsToXml,
    xmlToXls
} from './documents';

import {
    imageToImage,
    gifToPng,
    pngToGif,
    showMetadata
} from './images';

import {
    createTar,
    extractTar,
    createGzip,
    extractGzip,
    createBzip2,
    extractBzip2,
    createRar,
    extractRar,
    createZip,
    extractZip
} from './archives';
*/

export function setupConversion(inputFileName: string, blobPath: string, outputExt: string) {
  const extension = path.extname(inputFileName);
  if (extension === '') {
    throw new Error('Input file must have an extension');
  }

  const id = path.basename(blobPath);
  const scratch = fs.mkdtempSync('/tmp/flux_converter_');

  const inputPath = path.join(scratch, inputFileName);
  fs.symlinkSync(path.resolve(blobPath), inputPath);

  const outputPath = path.join(scratch, `${id}${outputExt}`);

  return [inputPath, outputPath, scratch];
}

/**
 * Get the converter function and the extension of the converted file.
 */
export function converterFromName(name: string): [any, string] {
  if (name === 'md-to-pdf') {
    return [documents.markdownToPdf, '.pdf'];
  } else if (name === 'text-to-pdf') {
    return [documents.textToPdf, '.pdf'];
  } else if (name === 'jpeg-to-pdf') {
    return [documents.imageToPdf, '.pdf'];
  } else if (name === 'png-to-pdf') {
    return [documents.imageToPdf, '.pdf'];
  } else if (name === 'pdf-to-jpeg') {
    return [documents.pdfToImage, '.jpeg'];
  } else if (name === 'pdf-to-png') {
    return [documents.pdfToImage, '.png'];
  } else if (name === 'doc-to-pdf') {
    return [documents.docToPdf, '.pdf'];
  } else if (name === 'pdf-to-doc') {
    return [documents.pdfToDoc, '.doc'];
  } else if (name === 'ppt-to-pdf') {
    return [documents.pptToPdf, '.pdf'];
  } else if (name === 'pdf-to-ppt') {
    return [documents.pptToPdf, '.ppt'];
  } else if (name === 'png-to-jpeg') {
    return [images.imageToImage, '.jpeg'];
  } else if (name === 'jpeg-to-png') {
    return [images.imageToImage, '.png'];
  } else if (name === 'gif-to-png') {
    return [images.gifToPng, '.zip'];
  } else if (name === 'png-to-gif') {
    return [images.pngToGif, '.gif'];
  } else {
    throw new Error(`Unknown converter name ${name}`);
  }
}
