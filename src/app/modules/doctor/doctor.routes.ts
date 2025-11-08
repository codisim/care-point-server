import express from "express"
import { DoctorController } from "./doctor.controller";

const router = express.Router()



router.get(
    "/",
    DoctorController.getAllDoctorFromDB
)



export const scheduleRoutes = router;
