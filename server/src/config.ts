import { configDotenv } from 'dotenv';
import fromEnv from './utils/env';
import lodash from 'lodash';

configDotenv();

export const appConfig = {
  corsAllowedOrigins: Array.from(
    fromEnv('CORS_ALLOWED_ORIGINS').split(','),
    (x) => lodash.trim(x, '/'),
  ),
  mongoConStr: fromEnv('MONGO_CON_STR'),
};

console.log(appConfig);
