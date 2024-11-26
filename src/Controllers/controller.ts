import { Request, Response } from 'express';
import { ChatService } from '../Services/Chat.service';
import * as grpc from '@grpc/grpc-js';
import { Service } from 'protobufjs';

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
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
      console.log('request', data);
      const response = await chatService.createMessage(data);



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
      const chatService = new ChatService();
      const {courseId, limit, before} = call.request;
      
      const response = await chatService.getCourseMessages(courseId,limit,before);
      
      // Convert messages to protobuf message objects
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
}