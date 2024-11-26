import mongoose from "mongoose";
import "dotenv/config";
import { configs } from "./ENV.config";
  
const connectDB = async () => {
  try { 
    if (!configs.MONGODB_URL_COURSE) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }

    await mongoose.connect(configs.MONGODB_URL_COURSE);
    console.log("Chat Service Database connected");
  } catch (error: any) {
    console.error("Chat service error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export { connectDB }; 