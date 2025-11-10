import express from "express"
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/enums";
import { AppoinmentControllers } from "./appoinment.controller";

const router = express.Router()



router.post(
    "/",
    auth(UserRole.PATIENT, UserRole.ADMIN, UserRole.DOCTOR),
    AppoinmentControllers.createAppoinment
)



export const appoinmentRoutes = router;