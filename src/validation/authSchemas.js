import Joi from 'joi';
import { emailRegexp } from '../constants/auth-constans.js';

export const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required',
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.empty': 'Email is required',
    'string.pattern.base': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.empty': 'Email is required',
    'string.pattern.base': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
});
