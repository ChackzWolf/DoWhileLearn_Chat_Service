import mongoose from "mongoose";
import { startGrpcServer } from "./Grpc.server";
import { connectDB } from "./Configs/Db.configs";
import { ChatController } from "./Controllers/controller";

const controller = new ChatController()
controller.start()
  .catch(error => console.error('Failed to start kafka order service:', error));

startGrpcServer()
connectDB() 