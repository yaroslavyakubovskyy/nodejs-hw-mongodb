import Joi from 'joi';

export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'The name field is required',
    'string.base': 'Name must be a string',
  }),
  phoneNumber: Joi.string().required(),
  email: Joi.string(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().messages({
    'string.base': 'Name must be a string',
  }),
  phoneNumber: Joi.string(),
  email: Joi.string(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});
