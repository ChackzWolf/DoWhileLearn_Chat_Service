
import { IChatMessage } from '../Models/Message.model';
import { kafkaConfig } from "../Configs/Kafka_Configs/Kafka.config";
import { OrderEventData } from '../Interfaces/DTOs/IController';
import { IChatService } from '../Interfaces/IService.Interface/IChatService.interface';
import { IChatRoom } from '../Interfaces/IModels/IChatRooms';
import { IChatMessageRepository } from '../Interfaces/IRepository/IChatMessage.interface';
import { IReadStatusRepository } from '../Interfaces/IRepository/IReadStatusRepository.interface';
import { IChatRoomRepository } from '../Interfaces/IRepository/IChatRoomRepository';
import { kafka_Const } from '../Configs/Kafka_Configs/Topic.config';


export class ChatService implements IChatService {

    private chatMessageRepository: IChatMessageRepository;
    private readStatusRepo: IReadStatusRepository;
    private chatRoomRepo: IChatRoomRepository;

    constructor(chatMessageRepository: IChatMessageRepository,readStatusRepo: IReadStatusRepository,chatRoomRepo: IChatRoomRepository) {
        this.chatMessageRepository = chatMessageRepository
        this.readStatusRepo = readStatusRepo
        this.chatRoomRepo = chatRoomRepo
    }

    async handleCoursePurchase(paymentEvent: OrderEventData): Promise<void> {
        const { courseId, title, thumbnail, tutorId, userId, transactionId } = paymentEvent;
        try {
            console.log('trigered chat handle course purchase')

            const chatRoom = await this.chatRoomRepo.createChatRoom(courseId, title, thumbnail, tutorId);
            console.log(chatRoom, 'this is chatroom return')
            if (!chatRoom) {
                throw new Error("chatroom success is false");
            }

            const response = await this.chatRoomRepo.addParticipant(courseId, userId);
            console.log('response froim repo', response)
            if (!response) {
                throw new Error("chatroom success is false");
            }
            console.log('sending success message');
            await kafkaConfig.sendMessage(kafka_Const.topics.CHAT_RESPONSE, {
                success: true,
                service: 'chat-service',
                status: 'COMPLETED',
                transactionId: transactionId
            });
            console.log('after sennding the message hahaha')
        } catch (error: any) {
            console.error('Order processing failed:', error);


            await kafkaConfig.sendMessage(kafka_Const.topics.CHAT_RESPONSE, {
                success: true,
                service: 'chat-service',
                status: 'COMPLETED',
                transactionId: transactionId
            });

            // Notify orchestrator of failure 
            // await kafkaConfig.sendMessage(kafka_Const.topics.CHAT_RESPONSE, {
            //     ...paymentEvent,
            //     service: 'chat-service',
            //     status: 'FAILED',
            //     error: error.message
            // }); 
            console.log('after sennding the message hahaha')
        }

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

    async deleteParticipantFromChatRoom(courseId: string, userId: string, transactionId: string):Promise<void> {
        try {
            const response = this.chatRoomRepo.removeParticipant(courseId, userId);
            if (!response) {

            }
            await kafkaConfig.sendMessage('rollback-completed', {
                transactionId: transactionId,
                service: 'chat-service'
            });
        } catch (error:any) {
            throw(error);
        }
    }
    async createMessage(messageData: {courseId: string;userId: string;username: string;content: string;imageUrl:string}): Promise<IChatMessage> {
        console.log(messageData, 'message thats going to save')
        const { courseId, content, userId, username } = messageData;
        const data = {
            userId, username, content
        }
        await this.chatRoomRepo.updateLastMessage(courseId, data);
        return await this.chatMessageRepository.saveMessage({
            ...messageData,
            timestamp: new Date()
        });

    }

    async getCourseMessages(courseId: string,page: number = 1,limit: number = 50): Promise<{ messages: IChatMessage[], total: number }> {
        console.log('')
        const response = await this.chatMessageRepository.getMessagesByCourseId(courseId, page, limit);
        console.log(response, 'resposne from service');
        return response
    }


    async markMessagesAsRead(userId: string, courseId: string): Promise<void> {
        await this.readStatusRepo.updateLastRead(userId, courseId, new Date());
    }

    async getChatRooms():Promise<{ courseId: string; lastMessage: { userId: string; username: string; content: string } | null }[]>  {
        return await this.chatRoomRepo.getAllChatRooms();
    }



    async getUserChatRooms(data: { userId: string }):Promise<IChatRoom[]> {
        return await this.chatRoomRepo.getUserChatRooms(data.userId)
    }
}
