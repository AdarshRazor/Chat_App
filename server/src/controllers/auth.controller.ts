import { Request, Response, NextFunction, RequestHandler } from "express";
import User, { IUser } from "../models/user.model";
import { generateAuthToken } from "../middleware/authToken.middleware";
import { Token } from "../models/token.model";
import sendEmail from "../utils/sendEmail";

// Utility function to handle async errors
export const asyncHandler = (fn: RequestHandler) => 
    (req: Request, res: Response, next: NextFunction) => 
      Promise.resolve(fn(req, res, next)).catch(next);

//Safety for ApiError coz error takes only 1
class ApiError extends Error {
    statusCode: number
    message: string
    constructor(statusCode:number, message:string){
        super(message);
        this.statusCode = statusCode
        this.message = message
    }
}

//wrap the function in asynchandler to get more precise
export const registerUser = asyncHandler(async (req: Request,res: Response):Promise<void> => {
    try{
        //no need to do that because already passing through a zod validation in authRoute
        const { name, email, password } = req.body;

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.verified) {
        throw new ApiError(409, 'Email already registered');
        }
        if (existingUser && existingUser.verificationLinkSent) {
            res.status(400).send({message: 'A verification link has been already sent to this Email'})
            return;
        }
        
        // Save the user
        const newUser = await new User({...req.body, verificationLinkSent: true}).save()

        // Generate access and refresh tokens
        const { accessToken } = generateAuthToken(newUser);

        //verify using email
        const url = `${process.env.BASE_URL}/users/${newUser._id}/verify/${accessToken}`;
        await sendEmail(newUser.email, "Verify Email", url);
        
        res.status(201)
        .send({ message: `Verification Email Sent to ${newUser.email}`});
    } catch (error){
        console.error("Error in registerController:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
})

export const loginUser = async (req:Request, res: Response) => {
    try {
        //get details from the body
        const { email, password } = req.body;

        //📧 Check for the user email and password
        const user = await User.findOne({ email });
        if (!user) {
        res.status(401).json({ message: "Invalid credentials. Email ID not Found" }); // Return immediately
        return
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials." }); // Return immediately
        return
        }

        // Check if the user's email is verified
        if (!user.verified) {
            res.status(400).send({ message: "User email not verified" });
        }

        // 🔻 refresh token and access token
        const { accessToken, refreshToken } = generateAuthToken(user);

        // Save refresh token to user document (Important for refresh token functionality)
        user.refreshToken = refreshToken;
        await user.save();

        // *** KEY CHANGE: Send accessToken in the Authorization header ***
        res.setHeader('Authorization', `Bearer ${accessToken}`);  // Or just accessToken if your middleware handles it

        // Send refreshToken as a cookie (Recommended for security)
        res.cookie('refreshToken', refreshToken, { 
        httpOnly: true, // Important: Prevents client-side JS access
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Helps prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days (same as refreshToken expiry)
        });

        // 🟢 send success in the end
        res.status(200).json({
        status: 'success',
        //  Do NOT send accessToken in the body anymore, it's in the header
        message: "Logged in successfully.",
        data: user.toAuthJSON()

        // data: {
        //   tokens: { accessToken, refreshToken }
        // },
        });
    } catch (error) {
        console.error("Error in loginController:", error);
        res.status(500).send({ message: "Internal Server Error" });
        }
}

// Verify email
export const verifyEmail = asyncHandler(async (req: Request, res: Response):Promise<void> => {
    try {
        // find user details
        const user = await User.findById(req.params.id);

        // find user by ID
        if (!user) {
            res.status(400).send({ message: "User doesn't exist" });
            return
        }

        // Check if the email is verified or not
        if (user.verified) {
            res.status(400).send({ message: "Email already verified" });
            return
        }

        // Find the token for the user
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });

        // check if token is expired or not
        if (!token) {
            res.status(400).send({ message: "Invalid Link" });
            return
        }
        if (token.expiresAt.getTime() < Date.now()) {
            user.verificationLinkSent = false;
            await user.save();
            res.status(400).send({ message: "Verification link has expired" });
            return
        }

        //mark the user verified
        user.verified = true;
        await user.save(); 

        // 🟢 send success in the end
        res.status(200).send({ message: "Email Verified Successfully" });
    } catch (error) {
        console.error("Error in verifyEmail:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});