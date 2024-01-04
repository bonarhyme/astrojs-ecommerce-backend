import mongoose, { MongooseError } from 'mongoose';

export const connectDatabase = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || '';
    const connection = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error: any) {
    const mongooseError = error as MongooseError;
    console.log(`Error: ${mongooseError.message}`);
    process.exit(1);
  }
};
