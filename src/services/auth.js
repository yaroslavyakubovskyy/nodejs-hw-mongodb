import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/auth-constans.js';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';

const createSession = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifetime,
  refreshTOkenValidUntil: Date.now() + refreshTokenLifetime,
});

export const findSession = (query) => SessionCollection.findOne(query);

export const findUser = (query) => UserCollection.findOne(query);

export const registerUser = async (payload) => {
  const { email, password } = payload;

  const existingUser = await UserCollection.findOne({ email });

  if (existingUser) throw createHttpError(409, 'Email in use');

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  return newUser;
};
export const loginUser = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password invalid');

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw createHttpError(401, 'Email or password invalid');

  const session = createSession();

  return SessionCollection.create({
    userId: user._id,
    ...session,
  });
};

export const refreshUser = async ({ refreshToken, sessionId }) => {
  const oldSession = await findSession({ refreshToken, _id: sessionId });
  if (!oldSession) throw createHttpError(401, 'Session not found');

  if (oldSession.refreshTOkenValidUntil < Date.now())
    throw createHttpError(401, 'Session token expired');

  await SessionCollection.findByIdAndDelete({ _id: oldSession._id });
  const session = createSession();

  return SessionCollection.create({
    userId: oldSession.userId,
    ...session,
  });
};

export const logoutUser = (_id) => SessionCollection.findOneAndDelete({ _id });

export const getUserByEmail = async (email) => {
  return UserCollection.findOne({ email });
};

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }
  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
  await SessionCollection.deleteOne({ userId: user._id });
};
