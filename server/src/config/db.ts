import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-leads';

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
}
