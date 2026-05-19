import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error('Missing required environment variable: MONGO_URI');
}

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
}
