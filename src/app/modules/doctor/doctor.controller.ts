import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { DoctorServices } from "./doctor.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../shared/pick";
import { doctorConstableFields } from "./doctor.constant";




const getAllDoctorFromDB = catchAsync(async(req: Request, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]); 
    const filters = pick(req.query, doctorConstableFields);

    const result = await DoctorServices.getAllFromDB(filters, options);

        sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctors retreivs successfuly..!",
        meta: result.meta,
        data: result.data
    })
})




const doctorGetByIdFromDb = catchAsync(async(req: Request, res: Response) => {
    
    const { id } = req.params;

    const result = await DoctorServices.doctorGetByIdFromDb(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor info fetched successfuly..!",
        data: result    
    })

})



const updateDoctorProfile = catchAsync(async(req: Request, res: Response) => {

    const { id } = req.params;

    const result = await DoctorServices.updateDoctorProfile(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctors profile updated successfuly..!",
        // meta: result.meta,
        data: result
    })
})

const getAISuggestion = catchAsync(async(req: Request, res: Response) => {

    const result = await DoctorServices.getAISuggestion(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "AI Suggestion fetched successfuly..!",
        data: result    
    })

})



export const DoctorController = {
    getAllDoctorFromDB,
    doctorGetByIdFromDb,
    updateDoctorProfile,
    getAISuggestion
}