import { Request, Response } from "express";
import User, {IUser} from "../models/user.model";

declare global {
    namespace Express {
      interface Request {
        user?: IUser;
      }
    }
  }

// Profile Controller
export const profileController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Unauthorized: User not authenticated" });
        return;
      }
    const user = await User.findById(req.user.id).select("-password"); // Exclude password field
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Profile Update Controller
export const profileUpdate = async (req: Request, res: Response): Promise<void> => {
  const { firstname, lastname, email, avatarLink } = req.body;
  
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

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.avatarLink = avatarLink || user.avatarLink;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const peopleController = async (req: Request, res: Response): Promise<void> => {
    try {
       //✔ return verified users.
      //const users: IUser[] = await User.find({ verified: true });
      const users: IUser[] = await User.find({
        firstname: { $exists: true, $ne: null }, // provide user who has firstname and lastname
        lastname: { $exists: true, $ne: null },
      }).select("-password");
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };