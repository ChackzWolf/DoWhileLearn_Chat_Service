import { IChatMessage } from "../../Models/Message.model";

export interface IChatMessageRepository {
    saveMessage(messageData: Partial<IChatMessage>): Promise<IChatMessage>
    getMessagesByCourseId(  courseId: string, page: number, limit: number): Promise<{ messages: IChatMessage[], total: number }>
}