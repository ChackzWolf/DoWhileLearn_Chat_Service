import { Server, ServerCredentials } from "@grpc/grpc-js";
import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ChatController } from "./Controllers/controller";
import { configs } from "./Configs/ENV.config";


export const startGrpcServer = () => {
  
  const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "Protos/Chat.proto"),
    {keepCase:true , longs: String, enums: String , defaults: true, oneofs: true}
  )
 
  const chatProto = grpc.loadPackageDefinition(packageDefinition) as any;


  const server = new Server();


  const PORT = configs.port || "5009";
  server.bindAsync(
    `localhost:${PORT}`,
    ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Failed to start gRPC server", err);
        return; 
      }
      console.log(`gRPC server is running on port ${port}`);
    }
  ); 




  server.addService(chatProto.ChatService.service , {
    saveMessage: ChatController.saveMessage,
    GetMessages: ChatController.getCourseMessages,
    GetChatRooms: ChatController.getChatRooms,
    CreateChatRoom: ChatController.createChatRoom,
    GetUserChatRooms: ChatController.chatRoomForUser,
  });
};
