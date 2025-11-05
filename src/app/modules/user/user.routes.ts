import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import { fileUploder } from "../../helper/fileUploder";
import express, { NextFunction, Request, Response } from "express"

const router = express.Router()


router.get("", UserController.getAllFromDB)

router.post(
    "/create-patient",
    fileUploder.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createPatient(req, res, next)
    }
)

router.post(
    "/create-doctor",
    fileUploder.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createDoctorValidationSchema.parse(JSON.parse(req.body.data));
        return UserController.createDoctor(req, res, next)
    }
)

router.post(
    "/create-admin",
    fileUploder.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createAdmin(req, res, next)
    }
);


export const userRoutes = router;
