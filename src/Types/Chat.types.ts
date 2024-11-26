export interface IChatMessage {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    contentType: 'text' | 'file' | 'emoji';
    fileUrl?: string;
    fileName?: string;
    readBy: string[];
    sentAt: Date;
    deliveredAt?: Date;
  }
  
  export interface IChatRoom {
    id: string;
    courseId: string;
    name: string;
    participants: string[];
    tutorId: string;
    createdAt: Date;
    lastMessageAt?: Date;
  }