import express from 'express';
import fs from 'fs';
import path from 'node:path';
import ejs from 'ejs';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const server = express();

server.set('view engine', 'ejs');

server.engine('ejs', async (path, data, cb) => {
  try {
    let html = await ejs.renderFile(path, data, { async: true });
    cb(null, html);
  } catch (e) {
    cb(e, '');
  }
});

function filesToRender(dir) {
  function readDirRecursive(dir, fileList) {
    fileList = fileList ?? [];

    const dirents = fs.readdirSync(dir, { withFileTypes: true });

    dirents.map((dirent) => {
      const filePath = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        fileList = readDirRecursive(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    });

    return fileList;
  }

  return readDirRecursive(dir)
    .filter((file) => path.extname(file) === '.ejs')
    .map((file) => file.substring(dir.length, file.length - 4));
}

function renderFile(file) {
  server.get(file, (_req, res) => {
    return res.render(file.slice(1));
  });

  if (file.slice(-5) === 'index') {
    server.get(file.substring(0, file.length - 5), (_req, res) => {
      return res.render(file.slice(1));
    });
  }
}

filesToRender('views').forEach(renderFile);

server.use(express.static('public'));

server.listen(PORT, () => {
  console.log(`Serving ejs from ${PORT}`);
});
