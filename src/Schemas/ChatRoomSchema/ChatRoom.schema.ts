import { Schema, model } from "mongoose";
import { IChatRoom } from "../../Interfaces/IModels/IChatRooms";

const ChatRoomSchema:Schema<IChatRoom> = new Schema({
  courseId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name:{
    type:String,
    required:true,
  },
  thumbnail:{
    type:String,
    required:true,
  },
  tutorId:{
    type:String,
    required:true,
  },
  participants: [{
    type:String,
  }],
  lastMessage: {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
  },
},{ timestamps: true });;

export const ChatRoomModel = model<IChatRoom>("ChatRoom", ChatRoomSchema);
