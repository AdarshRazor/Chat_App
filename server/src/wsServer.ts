import Message from './models/message.model';
import { verifyAuthToken } from './utils/jwt.utils';
import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import mongoose from "mongoose";
import { JwtPayload } from 'jsonwebtoken';

// Create Express app and HTTP server
const app = express();
const httpServer = createServer(app);

// Create Socket.IO server with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store active users
const activeUsers = new Map();

// Middleware to authenticate socket connections
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    const decoded = verifyAuthToken(token) as JwtPayload | null; // Type assertion

    if (!decoded || !decoded.userId) { // Check if decoded is not null and userId exists
      return next(new Error("Authentication error: Invalid token"));
    }

    socket.data.userId = decoded.userId;
    next();
  } catch (error) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", async (socket) => {
  const userId = socket.data.userId;
  
  // Store user connection
  activeUsers.set(userId, socket.id);
  
  // Inform other users about new user online
  io.emit("user_status", { userId, status: "online" });
  
  console.log(`User ${userId} connected. Socket ID: ${socket.id}`);
  
  // Send the active users list to the newly connected user
  const onlineUsers = Array.from(activeUsers.keys());
  socket.emit("active_users", onlineUsers);

  // Handle private messages
  socket.on("private_message", async (data) => {
    try {
      const { receiverId, message } = data;
      
      // Create and save message to database
      const chat = new Message({
        sender: new mongoose.Types.ObjectId(userId),
        receiver: new mongoose.Types.ObjectId(receiverId),
        message,
        createdAt: new Date(),
        read: false
      });
      
      await chat.save();
      
      // Get receiver's socket if they're online
      const receiverSocketId = activeUsers.get(receiverId);
      
      // Format message for sending
      const messageData = {
        _id: chat._id,
        sender: userId,
        receiver: receiverId,
        message,
        createdAt: chat.createdAt,
        read: false
      };
      
      // Send to sender (for their chat history)
      socket.emit("private_message", messageData);
      
      // Send to receiver if online
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("private_message", messageData);
      }
    } catch (error) {
      console.error("Error handling private message:", error);
    }
  });

  // Handle message read status
  socket.on("mark_as_read", async (data) => {
    try {
      const { messageId } = data;
      
      // Update message in database
      await Message.findByIdAndUpdate(messageId, { read: true });
      
      // Notify relevant users
      socket.emit("message_read", { messageId });
      
      const message = await Message.findById(messageId);
      if (message) {
        const senderSocketId = activeUsers.get(message.sender.toString());
        if (senderSocketId) {
          io.to(senderSocketId).emit("message_read", { messageId });
        }
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  });

  // Handle typing status
  socket.on("typing", (data) => {
    const { receiverId } = data;
    const receiverSocketId = activeUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { userId });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // Remove from active users
    for (let [key, value] of activeUsers.entries()) {
      if (value === socket.id) {
        activeUsers.delete(key);
        
        // Inform other users about offline status
        io.emit("user_status", { userId: key, status: "offline" });
        
        console.log(`User ${key} disconnected`);
        break;
      }
    }
  });
});

export const startSocketServer = (port: number) => {
    httpServer.listen(port, () => {
        console.log(`Socket.IO server attempting to run on port ${port}`);
    });

    httpServer.on('listening', ()=>{
        console.log(`Socket.IO server running on port ${port}`);
    })

    httpServer.on('error', (error)=>{
        console.log(`Socket.IO server error: ${error}`);
    })

    return io;
};