import { Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import httpStatus from 'http-status';
import { IJWTPayload } from "../../types/common";
import { AppoinmentServices } from "./appoinment.service";

const createAppoinment = catchAsync(async(req: Request & {user?: IJWTPayload}, res: Response) => {

    const user = req.user;
    const result = await AppoinmentServices.createAppoinment(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Appointment created successfully....!",
        data: result
    })
})

export const AppoinmentControllers = {
    createAppoinment
}