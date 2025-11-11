import express from "express"
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/enums";
import { AppoinmentControllers } from "./appoinment.controller";

const router = express.Router()



router.get(
    "/my-appoinment",
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    AppoinmentControllers.getMyAppoinment
)


router.post(
    "/",
    auth(UserRole.PATIENT),
    AppoinmentControllers.createAppoinment
)



export const appoinmentRoutes = router;