import createHttpError from 'http-errors';
import {
  getContacts,
  getContact,
  addContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { contactSortFields } from '../db/models/Contact.js';

export const getContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, contactSortFields);

  const data = await getContacts({ userId, page, perPage, sortBy, sortOrder });

  res.json({
    status: 200,
    message: 'Successfully find contacts',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await getContact({ _id: id, userId });
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
  const { _id: userId } = req.user;
  const data = await addContact(req.body, userId);
  res
    .status(201)
    .json({ status: 201, message: 'Successfully created a contact!', data });
};

export const upsertContactByIdController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const { isNew, data } = await updateContact({ _id: id, userId }, req.body, {
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
  const { _id: userId } = req.user;
  const result = await updateContact({ _id: id, userId }, req.body);

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
  const { _id: userId } = req.user;
  const data = await deleteContact({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }
  res.status(204).send();
};
