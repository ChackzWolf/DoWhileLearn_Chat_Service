import { KafkaMessage } from "kafkajs";

export interface OrderEventData {
    userId: string;
    tutorId: string;
    courseId: string;
    transactionId: string;
    title: string;
    thumbnail: string;
    price: string;
    adminShare: string; 
    tutorShare: string; 
    paymentStatus:boolean;
    timestamp: Date;
    status: string;
  }

  export interface RouteMessageRequestdto {
    topics:string[];
     message:KafkaMessage;
     topic:string;
  }