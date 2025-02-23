import express from "express";
import {avatarController} from "../controllers/avatar.controller";

const router = express.Router();

router.post("/", avatarController);
//router.get("/all", getAllAvatars);

export default router;
