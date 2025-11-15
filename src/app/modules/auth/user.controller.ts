import status from "http-status";
import { Request, Response } from "express";
import { AuthService } from "./user.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";


const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body)

    const {accessToken, refreshToken, needPasswordChange} = result

    res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60
    })

    res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 90
    })

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User login successfully..!",
        data: {
            needPasswordChange
        }
    })

})



const getMe = catchAsync(async (req: Request, res: Response) => {

    const userSession = req.cookies;
    const result = await AuthService.getMe(userSession)



    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User retrive successfully..!",
        data: result
    })

})



export const AuthController = {
    login,
    getMe
}