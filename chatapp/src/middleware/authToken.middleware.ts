import jwt, {TokenExpiredError } from "jsonwebtoken";
import {IUser} from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { verifyAuthToken } from "../utils/jwt.utils";

// Define an interface for the extended Request object
interface AuthRequest extends Request {
    user?: any; // You can define a more specific type here if you have a user interface
  }

// 🔴 Generate Access Token
export const generateAuthToken = (user: IUser) => {
    const accessToken = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET!,
        { expiresIn: '30m' }
    );
    const refreshToken = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d'}
    )
    return {accessToken, refreshToken};
};

// 🔴 verify Access Token
export const verifyToken = (req:AuthRequest, res:Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res
          .status(401)
          .json({ message: "Access Denied. No authHeader provided." });
          return
      }

    const token = authHeader.split(" ")[1];
    if (!token) {
    res.status(401).json({ message: "Access Denied. No token provided." });
    return
    }

    try {
        const decoded = verifyAuthToken(token);
        req.user = decoded; // Add user data to the request
        next();
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          res.status(401).json({
            code: "TOKEN_EXPIRED",
            message: "Your login session has expired. Please log in again.",
          });
          return;
        } else {
          console.error("An unexpected error occurred:", error);
          res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "An error occurred. Please try again later.",
          });
          return
        }
      }
}