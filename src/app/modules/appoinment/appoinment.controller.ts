import { AppoinmentServices } from "./appoinment.service";
import { Request, Response } from "express";
import { IJWTPayload } from "../../types/common";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import httpStatus from 'http-status';
import pick from "../../shared/pick";

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


const getMyAppoinment = catchAsync(async(req: Request & {user?: IJWTPayload}, res: Response) => {

    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]); 
    const filters = pick(req.query, ["status", "paymentStatus"]);

    const user = req.user;
    const result = await AppoinmentServices.getMyAppoinment(user as IJWTPayload, options, filters);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "My appoinmnet info fetched successfully....!",
        data: result
    })
})


export const AppoinmentControllers = {
    createAppoinment,
    getMyAppoinment
}