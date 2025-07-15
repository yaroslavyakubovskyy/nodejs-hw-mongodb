import multer from 'multer';

import { TEMP_DIR } from '../constants/index.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  destination: TEMP_DIR,
  filename: (req, file, cb) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 10,
};

const fileFilter = (req, file, cb) => {
  const extencion = file.originalname.split('.').pop();
  if (extencion === 'exe') {
    return cb(createHttpError(400, '.exe not allow file format '));
  }
  cb(null, true);
};

export const upload = multer({ storage, limits, fileFilter });
