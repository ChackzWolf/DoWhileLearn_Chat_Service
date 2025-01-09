import { KafkaMessage } from "kafkajs";
import * as grpc from '@grpc/grpc-js';


export interface IChatController {
    start(): Promise<void>;
    routeMessage(topics: string[], message: KafkaMessage, topic: string): Promise<void>;
    handleMessage(message: KafkaMessage): Promise<void>;
    handleRollback(message: KafkaMessage): Promise<void>;
    // Declare these as static methods
    saveMessage: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => Promise<void>;
    getCourseMessages: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => Promise<void>;
    getChatRooms: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => Promise<void>;
    createChatRoom: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => Promise<void>;
    chatRoomForUser: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => Promise<void>;
    chatRoomForTutor: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => Promise<void>;
  }