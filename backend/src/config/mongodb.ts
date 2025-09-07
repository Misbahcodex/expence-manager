import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_manager';

export const connectDatabase = async (retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 MongoDB connection attempt ${attempt}/${retries}`);
      console.log(`📡 Connecting to: ${MONGODB_URI.replace(/\/\/.*@/, '//*****@')}`);
      
      // Optimize connection settings for Railway deployment
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        socketTimeoutMS: 45000, // 45 seconds
        connectTimeoutMS: 10000, // 10 seconds
        maxPoolSize: 10, // Maximum connection pool size
        retryWrites: true,
        retryReads: true,
        bufferCommands: false, // Disable mongoose buffering
      });
      
      console.log('✅ MongoDB connected successfully');
      return; // Success, exit the retry loop
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${attempt}/${retries} failed:`, error);
      
      if (attempt === retries) {
        console.error('❌ All MongoDB connection attempts failed');
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`⏱️ Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
};

