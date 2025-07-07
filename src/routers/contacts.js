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
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contactSchemas.js';
import { isValidID } from '../middlewares/isValidId.js';
const contactsRouter = Router();
contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:id', isValidID, ctrlWrapper(getContactByIdController));
contactsRouter.post(
  '/',
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
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContactByIdController),
);
contactsRouter.delete(
  '/:id',
  isValidID,
  ctrlWrapper(deleteContactByIdControllers),
);
export default contactsRouter;
