import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  courseId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

const ChatMessageSchema: Schema = new Schema({
  courseId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const ChatMessageModel = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
