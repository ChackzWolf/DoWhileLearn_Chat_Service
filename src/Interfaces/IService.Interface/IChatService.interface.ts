import { IChatMessage } from "../../Models/Message.model";
import { OrderEventData } from "../DTOs/IController";
import { IChatRoom } from "../IModels/IChatRooms";

export interface IChatService {
    handleCoursePurchase(paymentEvent: OrderEventData): Promise<void>;
    deleteParticipantFromChatRoom(courseId: string, userId: string, transactionId: string):Promise<void>;
    createMessage(messageData: {courseId: string;userId: string;username: string;content: string;}): Promise<IChatMessage>;
    getCourseMessages(courseId: string, page: number, limit: number): Promise<{ messages: IChatMessage[], total: number }>;
    markMessagesAsRead(userId: string, courseId: string): Promise<void> ;
    getChatRooms():Promise<{ courseId: string; lastMessage: { userId: string; username: string; content: string } | null }[]>;
    createChatRoom(data:{courseId:string, courseName:string, thumbnail:string, tutorId:string}):Promise<{success:boolean}>
    getUserChatRooms(data: { userId: string }):Promise<IChatRoom[]>
}