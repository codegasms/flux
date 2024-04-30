import express from 'express';
import fs from 'fs';
import path from 'node:path';
import ejs from 'ejs';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const PORT = process.env.PORT || 3000;
const server = express();

server.use(cookieParser());

server.set('view engine', 'ejs');

server.engine('ejs', async (path, data, cb) => {
  try {
    let html = await ejs.renderFile(path, data, { async: true });
    cb(null, html);
  } catch (e) {
    cb(e, '');
  }
});

function dynamicRoutes(directory, route, routeList = []) {
  const dirents = fs.readdirSync(directory, { withFileTypes: true });
  let genericRoutes = [];

  dirents.map((dirent) => {
    const filePath = path.join(directory, dirent.name);

    if (dirent.isDirectory()) {
      let match;

      // TODO: Add support for catch-all and optional route parameters.
      if ((match = dirent.name.match(/^\[([_0-9A-Za-z]+)\]$/))) {
        const newRoute = `${route}/:${match[1]}`;
        genericRoutes.push([filePath, newRoute]);
      } else {
        const newRoute = `${route}/${dirent.name}`;
        dynamicRoutes(filePath, newRoute, routeList);
      }
    } else if (dirent.isFile() && dirent.name == 'index.ejs') {
      routeList.push([filePath, route || '/']);
    }
  });

  genericRoutes.forEach(([filePath, newRoute]) => {
    dynamicRoutes(filePath, newRoute, routeList);
  });

  return routeList;
}

function renderEjsAt(filePath, route) {
  server.get(route, (req, res) => {
    return res.render(filePath.slice('views/'.length, filePath.length - 4), {
      params: {
        ...req.params,
        server_url: process.env.SERVER,
        cookies: req.cookies,
      },
    });
  });
}

// WARNING: The routes are ordered from most specific to least specific. Do not mess with the order.
const routes = dynamicRoutes('views', '');

// TODO: Remove this debug log.
console.log(routes);

routes.forEach(([file, route]) => renderEjsAt(file, route));

server.use(express.static('public'));

server.listen(PORT, () => {
  console.log(`Serving ejs from ${PORT}`);
});
