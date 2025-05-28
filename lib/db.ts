import mongoose from "mongoose";

const uri = process.env.MONGODB_URI!;

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, {});
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
