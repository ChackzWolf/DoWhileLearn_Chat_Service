import { IChatRoom } from "../IModels/IChatRooms";

export interface IChatRoomRepository {
    updateLastMessage(courseId: string, message: { userId: string; username: string; content: string }): Promise<void>
    getAllChatRooms(): Promise<{ courseId: string; lastMessage: { userId: string; username: string; content: string } | null }[]>
    createChatRoom(courseId: string, courseName: string, thumbnail: string, tutorId: string): Promise<IChatRoom>
    addParticipant(courseId: string, userId: string): Promise<IChatRoom | null>
    removeParticipant(courseId:string, userId:string):Promise<IChatRoom | null>
    getUserChatRooms(userId:string):Promise<IChatRoom[]>
}