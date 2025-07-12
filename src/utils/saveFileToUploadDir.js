import { rename } from 'node:fs/promises';
import { join } from 'node:path';

import { UPLOADS_DIR } from '../constants/index.js';

export const saveFileToUploadDir = async (file) => {
  const { path: oldPath, filename } = file;
  const newPath = join(UPLOADS_DIR, filename);
  await rename(oldPath, newPath);
  return filename;
};
