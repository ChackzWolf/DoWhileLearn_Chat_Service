import { Server, ServerCredentials } from "@grpc/grpc-js";
import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ChatController } from "./Controllers/controller";
import { configs } from "./Configs/ENV.config";
import { ChatService } from "./Services/Chat.service";
import { ChatMessageRepository } from "./Repositories/MessageRepository/Message.repository";
import { ReadStatusRepository } from "./Repositories/ReadStatusRepository/ReadStatus.repository";
import { ChatRoomRepository } from "./Repositories/ChatRoomRepository/ChatRoom.repository";



export const startGrpcServer = () => {
  
  const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "Protos/Chat.proto"),
    {keepCase:true , longs: String, enums: String , defaults: true, oneofs: true}
  )
 
  const chatProto = grpc.loadPackageDefinition(packageDefinition) as any;


  const server = new Server();


  const PORT = configs.CHAT_GRPC_PORT || "5009";
  server.bindAsync(
    `0.0.0.0:${PORT}`,
    ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Failed to start gRPC server", err);
        return; 
      }
      console.log(`gRPC server is running on port ${port}`);
    }
  ); 

  const chatRoomRepo = new ChatRoomRepository();
  const readStatusRepo = new ReadStatusRepository();
  const chatMessageRepository = new ChatMessageRepository();
  const chatService = new ChatService(chatMessageRepository, readStatusRepo, chatRoomRepo);
  const chatController = new ChatController(chatService);

  server.addService(chatProto.ChatService.service , {
    saveMessage: chatController.saveMessage.bind(chatController),
    GetMessages: chatController.getCourseMessages.bind(chatController),
    GetChatRooms: chatController.getChatRooms.bind(chatController),
    CreateChatRoom: chatController.createChatRoom.bind(chatController),
    GetUserChatRooms: chatController.chatRoomForUser.bind(chatController),
  });

  chatController.start()
    .catch(error => console.error('Failed to start kafka order service:', error));
  
};

