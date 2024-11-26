import dotenv from 'dotenv';

dotenv.config();

export const configs = {
    port: process.env.PORT || 5009,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/elearning_chat',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:4001'],
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',


    
    // DB COFNIGS
    MONGODB_URL_COURSE : process.env.MONGODB_URL_COURSE || '',
  };