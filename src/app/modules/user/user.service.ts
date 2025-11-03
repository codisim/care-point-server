import bcrypt from "bcryptjs";
import { createPatientInput } from "./user.interface";
import { prisma } from "../../shared/prisma";
import { Request } from "express";
import { fileUploder } from "../../helper/fileUploder";



const createPatient = async( req: Request ) => {

 
    if(req.file){
        const fileUpload = await fileUploder.uploadToCloudinary(req.file)
        console.log({fileUpload})
    }





    // const hashedPass = bcrypt.hash(req.body.password, 12)

    // const result = await prisma.$transaction(async( tnx ) => {
    //     await tnx.user.create({
    //         data: {
    //             email: req.body.email,
    //             password: req.body.password
    //         }
    //     });

    //    return await tnx.patient.create({
    //         data: {
    //             name: req.body.name,
    //             email: req.body.email,
    //             address: req.body.address
    //         }
    //     })

    // })

    // return result

}

export const UserService = {
    createPatient
}