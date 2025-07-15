import path, { resolve } from 'node:path';
export const sortList = ['asc', 'desc'];

export const TEMPLATES_DIR = resolve('src', 'templates');

export const TEMP_DIR = resolve('temp');

export const UPLOADS_DIR = resolve('uploads');

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
