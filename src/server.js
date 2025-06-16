import express from 'express';
import cors from 'cors';
import { getContacts, getContactById } from './services/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';
export const startServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/contacts', async (req, res) => {
    const data = await getContacts();

    res.json({
      status: 200,
      message: 'Successfully find contacts',
      data,
    });
  });
  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const data = await getContactById(id);
    if (!data) {
      return res.status(404).json({
        message: `Contact with id=${id} not found`,
      });
    }
    res.json({
      status: 200,
      message: `Successfully find contact with id=${id}`,
      data,
    });
  });
  app.use((error, req, res, next) => {
    const { status = 500, message = 'Server error' } = error;
    res.status(status).json({ status, message });
  });

  app.use((req, res) => {
    res.status(404).json({
      message: `${req.url} not found`,
    });
  });

  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => console.log(`Server running on ${port} port`));
};
