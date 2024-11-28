// userReadStatus.schema.ts
import { Schema, model, Types } from "mongoose";

const ReadStatusSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  courseId: { type: String, required: true },
  lastRead: { type: Date, default: Date.now },
});

ReadStatusSchema.index({ userId: 1, groupId: 1 }, { unique: true }); // Ensure unique tracking per user/group

export const ReadStatusModel = model("ReadStatus", ReadStatusSchema);
