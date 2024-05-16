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

  mailer: {
    senderEmail: fromEnv('MAILER_SENDER_EMAIL'),
    passwd: fromEnv('MAILER_SENDER_PASS'),
    host: fromEnv('MAILER_HOST'),
  },

  redis: {
    host: fromEnv('REDIS_HOST'),
    port: parseInt(fromEnv('REDIS_PORT')),
  },

  frontendDomain: fromEnv('FRONTEND_DOMAIN'),

  debug: fromEnv('DEBUG', 'false').toLowerCase() === 'true',
};

console.log(appConfig);
