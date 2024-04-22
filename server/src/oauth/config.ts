import fromEnv from 'src/utils/env';
import { configDotenv } from 'dotenv';
configDotenv();
export const oauthConfig = {
  frontendUrl: fromEnv('FRONTEND_URL', 'http://localhost:3000/docs'),
  google: {
    clientID: fromEnv('GOOGLE_OAUTH_CLIENT_ID'),
    clientSecret: fromEnv('GOOGLE_OAUTH_CLIENT_SECRET'),
    callbackUrl: fromEnv('GOOGLE_OAUTH_CALLBACK_URL'),
    scopes: ['profile', 'email'],
  },
  github: {
    clientID: fromEnv('GITHUB_OAUTH_CLIENT_ID'),
    clientSecret: fromEnv('GITHUB_OAUTH_CLIENT_SECRET'),
    callbackUrl: fromEnv('GITHUB_OAUTH_CALLBACK_URL'),
    scopes: ['public_profile'],
  },
};
