// 👤 avatar creats a sepeate collection in DB. So, if you want it to make more efficient then - store the link in `user.model.ts` and make change in `user.controller.ts` - check avatar2.controller.ts

import { Request, Response } from "express";
import User from "../models/user.model";

// 🔻In your user.model.ts file, add an avatarLink field to the IUser interface and the User schema.
// user.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  // ... other user fields
  avatarLink?: string;
}

const UserSchema: Schema = new Schema({
  // ... other user schema fields
  avatarLink: { type: String, required: false },
});

export default mongoose.model<IUser>('User', UserSchema);
 
//🔻 profile controller

// profile.controller.ts


// Profile Update Controller
export const profileUpdate = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, avatarLink } = req.body;

    if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Unauthorized: User not authenticated" });
        return;
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.firstname = firstName || user.firstname;
        user.lastname = lastName || user.lastname;
        user.email = email || user.email;
        user.avatarLink = avatarLink || user.avatarLink;

        await user.save();
        res.json(user);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};