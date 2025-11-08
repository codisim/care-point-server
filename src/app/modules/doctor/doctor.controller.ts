import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorServices } from "./doctor.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../shared/pick";
import { doctorConstableFields } from "./doctor.constant";


const getAllDoctorFromDB = catchAsync(async(req: Request, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]); 
    const filters = pick(req.query, doctorConstableFields);

    const result = await DoctorServices.getAllDoctorFromDB(filters, options);

        sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctors retreivs successfuly..!",
        // meta: result.meta,
        data: result
    })
})

export const DoctorController = {
    getAllDoctorFromDB
}