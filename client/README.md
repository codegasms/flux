# flux-client

The flux app's web client lives here!

## Running

```shell
npm install
npm run start # run with node for deployment
```

## Developing

```shell
npm run tailwind # watch and generate tailwind as you code
npm run dev # run with nodemon for live reloads
npm run fmt # format your code
```

## Routing

(Assuming your app is running on [localhost:3000](http://localhost:3000))

- `views`: all the `/pages` of our app live here
  - `views/index.ejs` is available at `localhost:3000/`
  - `views/page.ejs` is available at `localhost:3000/page`
  - `views/folder/index.ejs` is available at `localhost:3000/folder`
  - `views/folder/page.ejs` is available at `localhost:3000/folder/page`
- `public` all the static files live here
  - `public/globals.css` is served at `localhost:3000/globals.css`
