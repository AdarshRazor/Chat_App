import { Request, Response } from 'express';
import Message from '../models/message.model';
import mongoose from 'mongoose';

// Get chat history between two users
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { receiverId } = req.params;
    
    // Validate receiverId
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      res.status(400).json({ message: 'Invalid receiver ID' });
      return
    }
    
    // Find all messages between these two users
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      { sender: receiverId, receiver: userId, read: false },
      { read: true }
    );
    
    res.status(200).json(messages);
    return
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Server error' });
    return
  }
};

// Get unread message count for a user
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    // Group unread messages by sender
    const unreadCounts = await Message.aggregate([
      { 
        $match: { 
            receiver: new mongoose.Types.ObjectId(userId?.toString()),
          read: false
        } 
      },
      {
        $group: {
          _id: '$sender',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json(unreadCounts);
    return
  } catch (error) {
    console.error('Error fetching unread counts:', error);
    res.status(500).json({ message: 'Server error' });
    return
  }
};

// Delete chat history
export const deleteChat = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { receiverId } = req.params;
    
    // Validate receiverId
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      res.status(400).json({ message: 'Invalid receiver ID' });
      return
    }
    
    // Delete all messages between these two users
    await Message.deleteMany({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId }
      ]
    });
    
    res.status(200).json({ message: 'Chat history deleted successfully' });
    return
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ message: 'Server error' });
    return
  }
};