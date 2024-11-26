import { IChatMessage, ChatMessageModel } from '../../Models/Message.model';

export class ChatMessageRepository {
  async saveMessage(messageData: Partial<IChatMessage>): Promise<IChatMessage> {
    const message = new ChatMessageModel(messageData);
    return await message.save();
  }

  async getMessagesByCourseId(
    courseId: string, 
    page: number = 1, 
    limit: number = 50
  ): Promise<{ messages: IChatMessage[], total: number }> {
    const skip = (page - 1) * limit;
    
    const [messages, total] = await Promise.all([
      ChatMessageModel.find({ courseId })
        .sort({ timestamp: 1 })
        .skip(skip)
        .limit(limit),
      ChatMessageModel.countDocuments({ courseId })
    ]);

    return { messages, total };
  }
}