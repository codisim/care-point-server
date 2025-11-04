import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";


const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Patient created successfully..!",
        data: result
    })

})


const createDoctor = catchAsync(async(req: Request, res: Response) => {
    const result = await UserService.createDoctor(req);

     sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor created successfully..!",
        data: result
    })
})

const getAllFromDB = catchAsync(async(req: Request, res: Response) => {
    const result = await UserService.getAllFromDB();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users retrive successfully..!",
        data: result
    })
})


export const UserController = {
    createPatient,
    createDoctor,
    getAllFromDB
}