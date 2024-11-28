import {kafkaConfig} from "../Configs/Kafka_Configs/Kafka.config"
import { KafkaMessage } from 'kafkajs';
import { ChatService } from '../Services/Chat.service';
import * as grpc from '@grpc/grpc-js';
import { OrderEventData } from "../Interfaces/DTOs/IController";

const chatService = new ChatService();
export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  } 

  async start(): Promise<void> {
    const topics =          [
      'chat.update',
      'chat-service.rollback'
    ]

    await kafkaConfig.consumeMessages(
      'chat-service-group', 
      topics, 
      this.routeMessage.bind(this)
    ); 
  }

  async routeMessage(topics:string[], message:KafkaMessage, topic:string):Promise<void>{ 
    try {
      switch (topic) {
        case 'chat.update':
            await this.handleMessage(message); 
            break;
        case 'chat-service.rollback': 
            await this.handleRollback(message);
            break;
        default: 
            console.warn(`Unhandled topic: ${topic}`);
      } 
    } catch (error) { 
      
    }
  }
  
  async handleMessage(message: KafkaMessage): Promise<void> {
    try {
      const paymentEvent: OrderEventData = JSON.parse(message.value?.toString() || '');
      
      console.log('START', paymentEvent, 'MESAGe haaha')
      await chatService.addParticipantToChatRoom(paymentEvent);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  async handleRollback(message:KafkaMessage): Promise<void>{
    try {
      console.log('triggered rollback,')
      const paymentEvent: OrderEventData = JSON.parse(message.value?.toString() || '');
      const {userId,courseId,transactionId} =  paymentEvent;
      console.log('START Role back', paymentEvent, 'MESAGe haaha');
      await chatService.deleteParticipantFromChatRoom(userId,courseId,transactionId);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  // gRPC Service Implementation
  static async saveMessage(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    try {
      const chatService = new ChatService();
      const request = call.request;  
      console.log(request, "request");
      const data = {
        courseId :request.courseId,
        userId : request.userId,
        username: request.username,
        content: request.content,
      } 

      const response  = await chatService.createMessage(data);
      console.log('response', response);
      if(!response){
        console.log('sending failed')
        callback(null,{message:request.content, success:false}) 
      }
      console.log('sednign success')
      callback(null,{message: request.content, success: true})
    } catch (error) {
      callback(error as grpc.ServiceError, null);
    }
  }

  // gRPC Service Implementation for fetching messages
  static async getCourseMessages(
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) {
    console.log('trig');
    try {

      const {courseId, userId, limit, before} = call.request;
      
      const response = await chatService.getCourseMessages(courseId,limit,before);
      await chatService.markMessagesAsRead(userId,courseId);

      const data = {
        messages : response.messages,
        hasMore : response.total > limit,
      }

      console.log(data, ' message responsedata from controller.')
      callback(null,data);

    } catch (error) {
      callback(error as grpc.ServiceError, null);
    }
  }

  static async getChatRooms(call: grpc.ServerUnaryCall<any,any>, callback: grpc.sendUnaryData<any>){
    try {
      const chatRooms = await chatService.getChatRooms();
      console.log(chatRooms);
      callback(null, {chatRooms});
    } catch (error) {
      callback(error as grpc.ServiceError, null); 
    }
  }

  static async createChatRoom(call: grpc.ServerUnaryCall<any,any>, callback: grpc.sendUnaryData<any>){
    try {
      console.log('trig', call.request);
      const data = call.request;
      const response = await chatService.createChatRoom(data);
      console.log(response), 'response from creating a chat room (controller)';
      callback(null, response);
    } catch (error) {
      callback(error as grpc.ServiceError, null); 
    }
  }

  static async chatRoomForUser(call: grpc.ServerUnaryCall<any,any>, callback: grpc.sendUnaryData<any>){
    console.log('trig fetch user chatrooms', call.request);
    const data = call.request;
    const response = await chatService.getUserChatRooms(data);
    console.log(response,'this is the response')

    callback(null, {chatRooms:response});
  }

  async chatRoomForTutor(call: grpc.ServerUnaryCall<any,any>, callback: grpc.sendUnaryData<any>){
    const data = call.request;
    const response = await chatService.getUserChatRooms(data);
    callback(null, response);
  }
} 