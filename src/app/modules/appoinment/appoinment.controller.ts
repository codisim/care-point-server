import { Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import httpStatus from 'http-status';

const createAppoinment = catchAsync(async(req: Request, res: Response) => {


    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Doctor created successfully....!",
        data: ""
    })
})

export const AppoinmentControllers = {
    createAppoinment
}