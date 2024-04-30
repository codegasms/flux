import { configDotenv } from 'dotenv';
import fromEnv from 'src/utils/env';

configDotenv();
export const spacesConfig = {
  fileStorageRootDir: fromEnv('SPACES_FILE_STORAGE_ROOT_DIR', './storage'),
};

console.log(spacesConfig);
