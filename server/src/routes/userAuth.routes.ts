import {Router, Request, Response, NextFunction} from "express"
import { z, ZodSchema } from "zod";
import { registerUser, loginUser, verifyEmail } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/authToken.middleware";
import {profileController, profileUpdate, peopleController} from "../controllers/profile.controller"
import messageController from "../controllers/message.controller";

const router = Router();

// 🔻 middlewares
const validate = (schema: ZodSchema) => 
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error: any) {
        res.status(400).json({
          status: "fail",
          errors: error.errors
        });
        return
      }
    }

const registerSchema = z.object({
  firstname: z.string().min(3, "firstName must be at least 3 characters long"),
  lastname: z.string().min(3, "lastName must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });


// 🖇 Routes
router.post('/register', validate(registerSchema),registerUser)
router.post('/login', validate(loginSchema),loginUser)
router.get("/:id/verify/:token", verifyEmail);
// GET /api/auth/users/:id - retrieve one user by id (protected)

router.get("/profile", verifyToken, profileController);
router.get("/messages/:userId", messageController);
router.get("/people", peopleController);
router.put("/profile/update", verifyToken, profileUpdate);

export default router;