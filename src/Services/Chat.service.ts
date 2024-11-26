import { ChatMessageRepository } from '../Repositories/MessageRepository/Message.repository';
import { IChatMessage } from '../Models/Message.model';

export class ChatService {
  private chatMessageRepository: ChatMessageRepository;

  constructor() {
    this.chatMessageRepository = new ChatMessageRepository();
  }

  async createMessage(messageData: {
    courseId: string;
    userId: string;
    username: string;
    content: string;
  }): Promise<IChatMessage> {
    return await this.chatMessageRepository.saveMessage({
      ...messageData,
      timestamp: new Date()
    });
  }

  async getCourseMessages(
    courseId: string, 
    page: number = 1, 
    limit: number = 50
  ): Promise<{ messages: IChatMessage[], total: number }> {
    console.log('')
    return await this.chatMessageRepository.getMessagesByCourseId(courseId, page, limit);
  }
}
