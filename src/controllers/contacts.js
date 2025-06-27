import createHttpError from 'http-errors';
import {
  getContacts,
  getContactById,
  addContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';
export const getContactsController = async (req, res) => {
  const data = await getContacts();

  res.json({
    status: 200,
    message: 'Successfully find contacts',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const data = await getContactById(id);
  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }
  res.json({
    status: 200,
    message: `Successfully find contact with id=${id}`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const data = await addContact(req.body);

  res
    .status(201)
    .json({ status: 201, message: 'Successfully created a contact!', data });
};

export const upsertContactByIdController = async (req, res) => {
  const { id } = req.params;
  const { isNew, data } = await updateContactById(id, req.body, {
    upsert: true,
  });
  const status = isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: 'Successfully upsert contact!',
    data,
  });
};

export const patchContactByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await updateContactById(id, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactByIdControllers = async (req, res) => {
  const { id } = req.params;
  const data = await deleteContactById(id);

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }
  res.status(204).send();
};
