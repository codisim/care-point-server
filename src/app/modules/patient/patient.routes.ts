import Express from "express";
import { PatientController } from "./patient.controller";

const router = Express.Router()


router.get(
    "/",
    PatientController.getAllPatientFromDB 
)


export const patientRoutes = router