import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../infrastructure/controllers/authController';
import documentRoutes from './routes/documentRoutes'
import profileRoutes from './routes/profileRoutes'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { registerDocumentSocket } from '../infrastructure/sockets/document';

dotenv.config();
const { MONGO_URL, PORT } = process.env;

if (!MONGO_URL) {
  throw new Error('Missing MONGO_URL in environment');
}
console.log("URL here: ", MONGO_URL);
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));


const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { 
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  },
});
registerDocumentSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH" ,"DELETE", "OPTIONS"],
    credentials: true,
  })
);

// app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use('/api/documents', documentRoutes);


app.use('/api/documents', documentRoutes);
app.use('/profile', profileRoutes);
app.use("/", authRoutes);
