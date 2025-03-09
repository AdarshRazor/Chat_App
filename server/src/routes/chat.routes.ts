import express from 'express';
import { verifyToken } from "../middleware/authToken.middleware";
import { getChatHistory, getUnreadCount, deleteChat } from '../controllers/chat.controller';

const router = express.Router();

// Apply auth middleware to all chat routes
router.use(verifyToken);

// Get chat history with a specific user
router.get('/history/:receiverId', getChatHistory);

// Get unread message counts
router.get('/unread', getUnreadCount);

// Delete chat history with a specific user
router.delete('/history/:receiverId', deleteChat);

export default router;