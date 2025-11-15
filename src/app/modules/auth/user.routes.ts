import { AuthController } from "./user.controller";
import express from "express"

const router = express.Router();


router.get(
    "/me",
    AuthController.getMe
)

router.post(
    "/login",
    AuthController.login
)


export const authRoutes = router;
 