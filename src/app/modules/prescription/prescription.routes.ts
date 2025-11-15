import express from "express"
import { PrescriptionController } from "./prescription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/enums";

const router = express.Router();


router.get(
    "/my-prescription",
    auth(UserRole.PATIENT),
    PrescriptionController.patientPrescription
)

router.post(
    "/",
    auth(UserRole.DOCTOR),
    PrescriptionController.createPrescription
)


export const prescriptionRoutes = router;
 