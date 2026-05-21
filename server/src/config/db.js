import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

let connectionPromise = null;

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MongoDB URI not found. Company intelligence cache disabled.");
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    await connectionPromise;
    console.log("MongoDB connected. Company intelligence cache enabled.");
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    console.warn("MongoDB connection failed:", error.message);
    return null;
  }
};

export const isDBConnected = () => mongoose.connection.readyState === 1;
