import mongoose from 'mongoose';
import config from './config.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('MONGODB CONNECTED SUCCESSFULLY.');
  } catch (error) {
    console.error('Unable to connect to datababse', error);
    process.exit(1);
  }
};
