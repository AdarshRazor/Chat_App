// 👤 avatar creats a sepeate collection in DB. So, if you want it to make more efficient then - store the link in `user.model.ts` and make change in `user.controller.ts` - check avatar2.controller.ts

import { Request, Response } from "express";
import { Avatar } from "../models/avatar.model";

interface AvatarRequestBody {
    link?: string;
}

export async function avatarController(req: Request,res: Response):Promise<void>{
    const { link } = req.body as AvatarRequestBody;
    
    // Check if the link is provided
    if (!link) {
        res.status(400).json({ error: "Link is required" });
        return
    }

    try{
        // Create a new avatar entry in the database
        const newAvatar = new Avatar({ link });
        await newAvatar.save();

        res
      .status(201)
      .json({ success: true, message: "Avatar link added successfully" });
      return
    } catch(error){
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
        return
    }
}

