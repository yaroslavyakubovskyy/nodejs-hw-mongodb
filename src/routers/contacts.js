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

const contactsRouter = Router();
contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:id', ctrlWrapper(getContactByIdController));
contactsRouter.post('/', ctrlWrapper(addContactController));
contactsRouter.put('/:id', ctrlWrapper(upsertContactByIdController));
contactsRouter.patch('/:id', ctrlWrapper(patchContactByIdController));
contactsRouter.delete('/:id', ctrlWrapper(deleteContactByIdControllers));
export default contactsRouter;
