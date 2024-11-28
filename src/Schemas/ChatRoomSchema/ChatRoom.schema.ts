import { Schema, model } from "mongoose";

const ChatRoomSchema = new Schema({
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
    unique:true
  }],
  lastMessage: {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
  },
},{ timestamps: true });;

export const ChatRoomModel = model("ChatRoom", ChatRoomSchema);
