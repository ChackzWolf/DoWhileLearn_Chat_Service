import mongoose, { Schema } from "mongoose";

export const ChatRoomSchema = new Schema({
    courseId: {
        type: String,
        required: true,
        unique: true
    },
    messages: [
        {
            userId: { 
                type: String, 
                required: true 
            },
            content: { 
                type: String, 
                required: true 
            },
            timestamp: { 
                type: Date, 
                default: Date.now 
            },
        },
    ],
});
