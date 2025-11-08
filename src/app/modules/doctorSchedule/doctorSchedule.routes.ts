import express from "express"
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/enums";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = express.Router()




router.post(
    "/",
    auth(UserRole.DOCTOR),
    DoctorScheduleController.insertIntoDB
)


export const doctorScheduleRoutes = router;
