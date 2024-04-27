# flux-server

ALl the server side code lives here!

## Running

### Environment Variables

Please set all the environment variables in `.env` as per the requirments outlined here.

_*For quick start, copy the `template.env` file to `.env`. The values given in `template.env` needs to be changed as per deployment parameters_

| Environment variable       | Purpose                                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| MONGO_CON_STR              | MongoDB Connection String, URI pointing to your database                                       |
| GOOGLE_OAUTH_CLIENT_ID     | Obtain From Google Cloud Console >> APIs and Services >>   Credentials >> OAuth 2.0 Client IDs |
| GOOGLE_OAUTH_CLIENT_SECRET | ^^                                                                                             |
| GOOGLE_OAUTH_CALLBACK_URL  | http://{yourDomain.com}/oauth/google/callback                                                  |
| GITHUB_OAUTH_CLIENT_ID     | GitHub Settings >> Developer Settings >> New OAuth App                                         |
| GITHUB_OAUTH_CLIENT_SECRET | ^^                                                                                             |
| GITHUB_OAUTH_CALLBACK_URL  | http://{yourDomain.com}/oauth/google/callback                                                  |
| RAZORPAY_KEY_ID            | Razorpay Dashboard >> Accounts & Settings >> Website & App Settings >> API Keys                |
| RAZORPAY_KEY_SECRET        | ^^                                                                                             |
| CORS_ALLOWED_ORIGINS       | Comma seperated list of allowed origins for CORS                                               |

### Cors and Cookies

- For security purposes, cookies are used in "same-site:strict" mode. On successful login/registration the backend sets the cookie `accessToken`.
- Any request to the backend, from [same site](https://portswigger.net/web-security/csrf/bypassing-samesite-restrictions), can send the cookies to backend.
- Make sure that the frontend has the same domain name of the backend. (deploy on a different sub-domain).
  - Use [`credentials: "include"`](https://developer.mozilla.org/en-US/docs/Web/API/fetch#credentials), in your `fetch` options, because `fetch` [does not send cookies automatically](https://reqbin.com/code/javascript/lcpj87js/javascript-fetch-with-credentials).
- The `CORS_ALLOWED_ORIGINS` env var must be correctly set, as described above.

    > **NOTE**: Doing anything else, would not be permitted by the standard CORS policy implemented by modern browsers.

### Development Mode

To start the backend server with hot-reload:

```shell
npm run dev
```

## Production Deployment

Nginx + PM2 + Certbot
