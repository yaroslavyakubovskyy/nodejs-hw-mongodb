import { startServer } from './server.js';
import { initMongodbConnection } from './db/initMongodbConnection.js';
import { createDirIfNotExist } from './utils/createDirIfNotExist.js';

import { TEMP_DIR, UPLOADS_DIR } from './constants/index.js';

const bootstrap = async () => {
  await initMongodbConnection();
  startServer();
  await createDirIfNotExist(TEMP_DIR);
  await createDirIfNotExist(UPLOADS_DIR);
};
bootstrap();
