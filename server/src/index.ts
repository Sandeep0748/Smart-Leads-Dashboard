import dotenv from 'dotenv';
import app from './app';
import { connectDatabase } from './config/db';

dotenv.config();

const port = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });
