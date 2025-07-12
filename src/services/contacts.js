import Contact from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
import { sortList } from '../constants/index.js';

export const getContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy,
  sortOrder = sortList[0],
}) => {
  const skip = (page - 1) * perPage;
  const filter = { userId };
  const items = await Contact.find(filter)
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const total = await Contact.countDocuments(filter);
  const paginationData = calcPaginationData({ page, perPage, total });
  return { items, total, ...paginationData };
};
export const getContact = (query) => Contact.findOne(query);
// export const addContact = (payload, userId) => {
//   return Contact.create({ ...payload, userId });
// };
export const addContact = (payload, userId, photo) => {
  const { userId: _, photo: __, ...rest } = payload;
  return Contact.create({
    ...rest,
    userId,
    photo,
  });
};
export const updateContact = async (query, payload, options = {}) => {
  const result = await Contact.findOneAndUpdate(query, payload, {
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
export const deleteContact = (query) => Contact.findOneAndDelete(query);
