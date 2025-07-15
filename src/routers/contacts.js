import { Router } from 'express';

import {
  getContactByIdController,
  getContactsController,
  addContactController,
  upsertContactByIdController,
  patchContactByIdController,
  deleteContactByIdControllers,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../utils/validateBody.js';

import { upload } from '../middlewares/upload.js';

import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contactSchemas.js';
import { isValidID } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:id', isValidID, ctrlWrapper(getContactByIdController));

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(contactAddSchema),
  ctrlWrapper(addContactController),
);

contactsRouter.put(
  '/:id',
  isValidID,
  validateBody(contactUpdateSchema),
  ctrlWrapper(upsertContactByIdController),
);

contactsRouter.patch(
  '/:id',
  isValidID,
  upload.single('photo'),
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContactByIdController),
);

contactsRouter.delete(
  '/:id',
  isValidID,
  ctrlWrapper(deleteContactByIdControllers),
);
export default contactsRouter;
