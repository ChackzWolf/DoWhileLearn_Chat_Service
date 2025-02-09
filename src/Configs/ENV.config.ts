import dotenv from 'dotenv';

dotenv.config();

export const configs = {
    port: process.env.PORT || 3009,
    CHAT_GRPC_PORT: process.env.CHAT_GRPC_PORT || 5009,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/elearning_chat',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:4001'],
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    // DB COFNIGS
    MONGODB_URL_CHAT : process.env.MONGODB_URL_CHAT || '',
    aws: {
      BUCKET_NAME: process.env.BUCKET_NAME || "",
      AWS_ACCESS_KEY_ID:process.env.AWS_ACCESS_KEY_ID || "",
      AWS_SECRET_ACCESS_KEY : process.env.AWS_SECRET_ACCESS_KEY ||"",
      AWS_REGION : process.env.AWS_REGION|| ""
    }
  };