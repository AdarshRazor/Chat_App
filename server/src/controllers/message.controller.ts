import { Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken';
import { verifyAuthToken } from "../utils/jwt.utils"; // Import JwtPayload
import Message from "../models/message.model";

// Define an interface for the extended Request object
interface AuthRequest extends Request {
  decodedToken?: JwtPayload; // Add a new property
}

const messageController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    // const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   res.status(401).json({ message: "Unauthorized: No token provided" });
    //   return;
    // }

    // const token = authHeader.split(" ")[1];
    // const userData = verifyAuthToken(token);

    // if (!userData) {
    //   res.status(401).json({ message: "Unauthorized: Invalid token" });
    //   return;
    // }

    // const ourUserId = (userData as JwtPayload).id; // Access id from JwtPayload
    // console.log("userData", userData);
    // console.log("ourUserId", ourUserId);
    // console.log("userId", userId);

    console.log("Fetching messages for sender:", userId);
    const messages = await Message.find({ sender: userId }).sort({ createdAt: 1 });
    console.log("Query result:", messages);

    res.json(messages);
    console.log("messages", messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default messageController;