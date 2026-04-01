import app from './src/app.js';
import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the server');
    process.exit(1);
  }
};

startServer();
