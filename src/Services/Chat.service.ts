import { ChatMessageRepository } from '../Repositories/MessageRepository/Message.repository';
import { ReadStatusRepository } from '../Repositories/ReadStatusRepository/ReadStatus.repository';
import { ChatRoomRepository } from '../Repositories/ChatRoomRepository/ChatRoom.repository';
import { IChatMessage } from '../Models/Message.model';
import { kafkaConfig } from "../Configs/Kafka_Configs/Kafka.config";


export class ChatService {
  private chatMessageRepository: ChatMessageRepository;
  private readStatusRepo: ReadStatusRepository;
  private chatRoomRepo: ChatRoomRepository;

  constructor() {
    this.chatMessageRepository = new ChatMessageRepository();
    this.readStatusRepo = new ReadStatusRepository() ;
    this.chatRoomRepo = new ChatRoomRepository();
  }



  async addParticipantToChatRoom(paymentEvent:any) {
    try {
      const {courseId, userId, transactionId} = paymentEvent;
      const response = this.chatRoomRepo.addParticipant(courseId,userId);
      if(!response){
        throw new Error("chatroom success is false");
      }
      console.log('sending success message');
      await kafkaConfig.sendMessage('chat.response', {
        success: true,
        service: 'chat-service',
        status: 'COMPLETED',
        transactionId: transactionId
      });
      console.log('after sennding the message hahaha')
    } catch (error:any) {
      console.error('Order processing failed:', error);
      
      // Notify orchestrator of failure
      await kafkaConfig.sendMessage('chat.response', {
        ...paymentEvent,
        service: 'chat-service',
        status: 'FAILED',
        error: error.message
      });
      console.log('after sennding the message hahaha')
    }
  }

  async deleteParticipantFromChatRoom(courseId:string,userId:string,transactionId:string) {
    try {
      const response = this.chatRoomRepo.removeParticipant(courseId,userId);
      if(!response){

      }
      await kafkaConfig.sendMessage('rollback-completed', {
        transactionId: transactionId,
        service: 'chat-service'
      });
    } catch (error) {
       
    }
  }
  async createMessage(messageData: {
    courseId: string;
    userId: string;
    username: string;
    content: string;
  }): Promise<IChatMessage> {
    const {courseId, content, userId, username} = messageData;
    const data ={
      userId, username, content
    }
    await this.chatRoomRepo.updateLastMessage(courseId,data);
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


  async markMessagesAsRead(userId: string, courseId: string): Promise<void> {
    await this.readStatusRepo.updateLastRead(userId, courseId, new Date());
  }

  async getChatRooms(){
    return await this.chatRoomRepo.getAllChatRooms();
  }

  async createChatRoom(data:{courseId:string, courseName:string, thumbnail:string, tutorId:string}):Promise<{success:boolean}>{
    console.log('trig service',data)
    const {courseId, courseName, thumbnail, tutorId} = data;
    const chatRoom = await this.chatRoomRepo.createChatRoom(courseId, courseName, thumbnail, tutorId);
    console.log('created chatroom (service)')
    if(!chatRoom){
      return {success:false}
    }
    return {success:true}
  }

  async getUserChatRooms(data:{userId:string}){
    return await this.chatRoomRepo.getUserChatRooms(data.userId)
  }
}
