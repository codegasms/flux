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

function dynamicRoutes(directory, route) {
  const dirents = fs.readdirSync(directory, { withFileTypes: true });

  let routeList = [];

  dirents.map(dirent => {
    const filePath = path.join(directory, dirent.name);

    if (dirent.isDirectory()) {
      let newRouteComponent = dirent.name;
      let match;

      // TODO: Add support for catch-all and optional route parameters.
      if (match = dirent.name.match(/^\[([_0-9A-Za-z]+)\]$/)) {
        newRouteComponent = `:${match[1]}`;
      }

      const newRoute = path.join(`${route}/${newRouteComponent}`);
      const childrenRoutes = dynamicRoutes(filePath, newRoute);

      childrenRoutes.forEach(([childPath, childRoute]) => {
        routeList.push([childPath, childRoute])
      });
    } else if (dirent.isFile() && dirent.name == 'index.ejs') {
      routeList.push([filePath, route]);
    }
  });

  return routeList;
}

function renderEjsAt(filePath, route) {
  server.get(route, (req, res) => {
    return res.render(filePath.slice('views/'.length, filePath.length - 4), {params: req.params});
  });
}

const routes = dynamicRoutes('views', '/')
console.log(routes);
routes.forEach(([file, route]) => renderEjsAt(file, route))

server.use(express.static('public'));

server.listen(PORT, () => {
  console.log(`Serving ejs from ${PORT}`);
});
