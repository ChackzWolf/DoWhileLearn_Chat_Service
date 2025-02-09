import { IChatRoom } from "../../Interfaces/IModels/IChatRooms";
import { IChatRoomRepository } from "../../Interfaces/IRepository/IChatRoomRepository";
import { ChatRoomModel } from "../../Schemas/ChatRoomSchema/ChatRoom.schema";

export class ChatRoomRepository implements IChatRoomRepository {
    async updateLastMessage(courseId: string, message: { userId: string; username: string; content: string }): Promise<void> {
        await ChatRoomModel.findOneAndUpdate(
          { courseId },
          { lastMessage: message },
          { upsert: true } // Create a new chat room if it doesn't exist
        );
      }
    
      async getAllChatRooms(): Promise<{ courseId: string; lastMessage: { userId: string; username: string; content: string } | null }[]> {
        const chatRooms = await ChatRoomModel.find({}, { courseId: 1, lastMessage: 1 }).lean();
      
        return chatRooms.map((room) => ({
          courseId: room.courseId,
          lastMessage: room.lastMessage || null, // Ensure a consistent return type
        }));
      }

      async createChatRoom(courseId: string, courseName: string, thumbnail: string, tutorId: string): Promise<IChatRoom> {
        try {
         // await  ChatRoomModel.collection.dropIndex('participants_1');
            // Try to find the existing chat room
            let chatRoom = await ChatRoomModel.findOne({ courseId });
    
            if (chatRoom) {
                console.log('chat room exists', chatRoom);
                // If the chat room exists, just update the non-critical fields
                chatRoom.name = courseName;
                chatRoom.thumbnail = thumbnail;
                chatRoom.tutorId = tutorId;
    
                // Ensure participants is always an array and not undefined
                chatRoom.participants = chatRoom.participants || [];
    
                // Save the updated chat room
                return await chatRoom.save();
            } else {
                console.log('creating new chat room');
                // If no chat room exists, create a new one with the initial message and participants
                return await ChatRoomModel.create({
                    courseId,
                    name: courseName,
                    thumbnail: thumbnail,
                    tutorId,
                    lastMessage: {
                        userId: '123',
                        username: 'Tutor',
                        content: "Start your discussion"
                    },
                    participants: []  // Initialize an empty participants array
                });
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async participantExists(courseId: string, userId: string): Promise<boolean> {
      console.log(courseId, userId, 'this is course id and user id in participant exists');
        const chatRoom = await ChatRoomModel.findOne({ courseId, participants: userId });
        return !!chatRoom;
    }
    
    async addParticipant(courseId: string, userId: string): Promise<IChatRoom | null> {
        try {
            console.log(courseId, userId, 'triggering add participant');
            
            const exists = await this.participantExists(courseId, userId);
            console.log(exists, 'thi si participant expist or not')
            if (exists) {
                console.log('Participant already exists');
                return null;
            }
    
            return await ChatRoomModel.findOneAndUpdate(
                { courseId },
                { $addToSet: { participants: userId } },
                { new: true, upsert: true }
            );
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }

      async removeParticipant(courseId:string, userId:string):Promise<IChatRoom | null> {
        try {
            return await ChatRoomModel.findOneAndUpdate(
                {courseId},
                {$pull: {participants:userId}},
                {new:true}
            )
        } catch (error) {
            console.log(error)
            throw(error)
        }
      }

    async getUserChatRooms(userId:string):Promise<IChatRoom[]>{
      try {
        return await ChatRoomModel.find({participants:userId}).lean()
      } catch (error) {
        console.log(error)
        throw error;
      }
    }
}