import Contact from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
import { sortList } from '../constants/index.js';
export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy,
  sortOrder = sortList[0],
}) => {
  const skip = (page - 1) * perPage;
  const items = await Contact.find()
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const total = await Contact.countDocuments();
  const paginationData = calcPaginationData({ page, perPage, total });
  return { items, total, ...paginationData };
};
export const getContactById = (id) => Contact.findById(id);
export const addContact = (payload) => Contact.create(payload);
export const updateContactById = async (id, payload, options = {}) => {
  const result = await Contact.findByIdAndUpdate(id, payload, {
    includeResultMetadata: true,
    ...options,
  });

  if (!result || !result.value) return null;

  const isNew = Boolean(result?.lastErrorObject?.upserted);

  return {
    isNew,
    data: result?.value,
  };
};
export const deleteContactById = async (id) => Contact.findByIdAndDelete(id);
