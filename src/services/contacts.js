import Contact from '../db/models/Contact.js';
export const getContacts = () => Contact.find();
export const getContactById = (id) => Contact.findById(id);
export const addContact = (payload) => Contact.create(payload);
export const updateContactById = async (id, payload, options = {}) => {
  const result = await Contact.findByIdAndUpdate(id, payload, {
    new: true,
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
