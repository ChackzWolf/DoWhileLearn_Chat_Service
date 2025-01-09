import { ReadStatusModel } from "../../Schemas/ReadStatusSchema/ReadStatus.schema";
import { IReadStatusRepository } from "../../Interfaces/IRepository/IReadStatusRepository.interface";

export class ReadStatusRepository implements IReadStatusRepository {
  async getLastReadTimestamp(userId: string, courseId: string): Promise<Date> {
    const status = await ReadStatusModel.findOne({ userId, courseId });
    return status ? status.lastRead : new Date(0); // Default to the earliest date
  }

  async updateLastRead(userId: string, courseId: string, timestamp: Date): Promise<void> {
    await ReadStatusModel.findOneAndUpdate(
      { userId, courseId },
      { lastRead: timestamp },
      { upsert: true }
    );
  }
}