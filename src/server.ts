import mongoose from "mongoose";
import { startGrpcServer } from "./Grpc.server";
import { connectDB } from "./Configs/Db.configs";


startGrpcServer()
connectDB() 