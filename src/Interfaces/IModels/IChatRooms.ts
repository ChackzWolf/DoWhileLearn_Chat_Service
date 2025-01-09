export interface IChatRoom {
    id: string;
    courseId: string;
    name: string;
    thumbnail: string;
    tutorId: string;
    participants: string[];
    lastMessage: {
      userId: string;
      username: string;
      content: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
  }