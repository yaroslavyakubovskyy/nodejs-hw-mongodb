import nodemailer from 'nodemailer';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import handlebars from 'handlebars';
import 'dotenv/config';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } =
  process.env;

const nodemailerConfig = {
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const TEMPLATES_DIR = resolve('src', 'templates');

export const sendEmail = async ({
  to,
  subject,
  html,
  templateName,
  context = {},
}) => {
  let finalHtml = html;

  if (!html && templateName) {
    try {
      const filePath = resolve(TEMPLATES_DIR, `${templateName}.html`);
      const source = await readFile(filePath, 'utf-8');
      const template = handlebars.compile(source);
      finalHtml = template(context);
    } catch (error) {
      console.error('Template read/compile error:', error.message);
      throw new Error('Email template error');
    }
  }

  const email = {
    from: SMTP_FROM,
    to,
    subject,
    html: finalHtml,
  };

  return transport.sendMail(email);
};
