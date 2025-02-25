import { kafkaConfig } from "../Configs/Kafka_Configs/Kafka.config"
import { KafkaMessage } from 'kafkajs';
import * as grpc from '@grpc/grpc-js';
import { OrderEventData } from "../Interfaces/DTOs/IController";
import { IChatService } from "../Interfaces/IService.Interface/IChatService.interface";
import { IChatController } from "../Interfaces/IController.interface/IChatController.interface";
import { kafka_Const } from "../Configs/Kafka_Configs/Topic.config";


export class ChatController implements IChatController {

    private chatService: IChatService;

    constructor(chatService: IChatService) {
        this.chatService = chatService
    }

    async start(): Promise<void> {
        const topics = [
            kafka_Const.topics.CHAT_UPDATE,
            kafka_Const.topics.CHAT_ROLLBACK
        ]

        await kafkaConfig.consumeMessages(
            kafka_Const.CHAT_SERVICE_GROUP_NAME,
            topics,
            this.routeMessage.bind(this)
        );
    }

    async routeMessage(topics: string[], message: KafkaMessage, topic: string): Promise<void> {
        try {
            switch (topic) {
                case kafka_Const.topics.CHAT_UPDATE:
                    await this.handleMessage(message);
                    break;
                case kafka_Const.topics.CHAT_ROLLBACK:
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
            await this.chatService.handleCoursePurchase(paymentEvent)
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    async handleRollback(message: KafkaMessage): Promise<void> {
        try {
            console.log('triggered rollback,')
            const paymentEvent: OrderEventData = JSON.parse(message.value?.toString() || '');
            const { userId, courseId, transactionId } = paymentEvent;
            console.log('START Role back', paymentEvent, 'MESAGe haaha');
            await this.chatService.deleteParticipantFromChatRoom(userId, courseId, transactionId);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }

    // gRPC Service Implementation
    async saveMessage(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            const request = call.request;
            console.log(request, "request");
            const data = {
                courseId: request.courseId,
                userId: request.userId,
                username: request.username,
                imageUrl: request.imageUrl,
                content: request.content,
            }

            const response = await this.chatService.createMessage(data);
            console.log('response', response);
            if (!response) {
                console.log('sending failed')
                callback(null, { message: request.content, success: false })
            }
            console.log('sednign success')
            callback(null, { message: request.content, success: true })
        } catch (error) {
            callback(error as grpc.ServiceError, null);
        }
    }

    // gRPC Service Implementation for fetching messages
    async getCourseMessages(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        console.log('trig', call.request);
        try {

            const { courseId, userId, limit, before } = call.request;

            const response = await this.chatService.getCourseMessages(courseId, limit, before);
            // await this.chatService.markMessagesAsRead(userId,courseId);

            const data = {
                messages: response.messages,
                hasMore: response.total > limit,
            }

            // console.log(data, ' message responsedata from controller.')
            callback(null, data);

        } catch (error) {
            callback(error as grpc.ServiceError, null);
        }
    }

    async getChatRooms(_call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            const chatRooms = await this.chatService.getChatRooms();
            console.log(chatRooms);
            callback(null, { chatRooms });
        } catch (error) {
            callback(error as grpc.ServiceError, null);
        }
    }

    async createChatRoom(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            console.log('trig', call.request);
            const data = call.request;
            const response = await this.chatService.createChatRoom(data);
            console.log(response), 'response from creating a chat room (controller)';
            callback(null, response);
        } catch (error) {
            callback(error as grpc.ServiceError, null);
        }
    }

    async chatRoomForUser(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        console.log('trig fetch user chatrooms', call.request);
        const data = call.request;
        const response = await this.chatService.getUserChatRooms(data);
        callback(null, { chatRooms: response });
    }

    async chatRoomForTutor(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        const data = call.request;
        const response = await this.chatService.getUserChatRooms(data);
        callback(null, response);
    }
} 