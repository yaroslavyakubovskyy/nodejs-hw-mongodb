import {
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
  getUserByEmail,
  resetPassword,
} from '../services/auth.js';

import { refreshTokenLifetime } from '../constants/auth-constans.js';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { sendEmail } from '../utils/sendEmail.js';

const { JWT_SECRET, APP_DOMAIN } = process.env;

const setupSession = (res, { _id, refreshToken }) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + refreshTokenLifetime),
  });
  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: new Date(Date.now() + refreshTokenLifetime),
  });
};

export const registerController = async (req, res) => {
  await registerUser(req.body);
  res.json({
    message: 'Successfully register user',
  });
};

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully login user',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const session = await refreshUser(req.cookies);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refresh user',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const sendResetEmailController = async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email, sub: user._id.toString() }, JWT_SECRET, {
    expiresIn: '5m',
  });
  const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

  try {
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      templateName: 'resetPasswordEmail',
      context: { resetLink },
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    console.error('Email send error:', err.message);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset!',
    data: {},
  });
};
