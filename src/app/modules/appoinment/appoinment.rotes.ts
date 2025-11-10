import express from "express"
import { AppoinmentControllers } from "./appoinment.controller"

const router = express.Router()



router.post(
    "/",
    AppoinmentControllers.createAppoinment
)



export const appoinmentRoutes = router;