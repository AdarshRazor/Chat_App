import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";

export const generateAuthToken = (user: IUser, secret: string, expiresIn: string = "7d"): string => {
    if (!secret) {
        throw new Error("Secret key is missing."); // Handle missing secret
    }

    const token = jwt.sign(
        {
            _id: user._id,
            firstName: user.firstname,
            lastName: user.lastname,
            email: user.email,
        },
        secret,
        { expiresIn }
    );
    return token;
};