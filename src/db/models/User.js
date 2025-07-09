import { Schema, model } from 'mongoose';
import { saveErrorHandler, setUpdateSettings } from './hooks.js';
import { emailRegexp } from '../../constants/auth-constans.js';
const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      match: emailRegexp,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { versionKey: false, timestamps: true },
);
userSchema.post('save', saveErrorHandler);
userSchema.post('findOneAndUpdate', setUpdateSettings);
userSchema.post('findOneAndUpdate', saveErrorHandler);

const UserCollection = model('user', userSchema);

export default UserCollection;
