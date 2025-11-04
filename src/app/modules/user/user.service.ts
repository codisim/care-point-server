import bcrypt from "bcryptjs";
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { fileUploder } from "../../helper/fileUploder";
import { UserRole } from "../../../generated/enums";



const createPatient = async (req: Request) => {

    if (req.file) {
        const fileUpload = await fileUploder.uploadToCloudinary(req.file)
        req.body.patient.profilePhoto = fileUpload?.secure_url
    }

    const hashedPass = await bcrypt.hash(req.body.password, 10)

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: req.body.patient.email,
                password: hashedPass
            }
        });

        return await tnx.patient.create({
            data: req.body.patient
        })
    })

    return result
}


const createDoctor = async (req: Request) => {

    if (req.file) {
        const fileUpload = await fileUploder.uploadToCloudinary(req.file)
        req.body.doctor.profilePhoto = fileUpload?.secure_url
    }

    const hashedPass = await bcrypt.hash(req.body.password, 10)
     const userData = {
        email: req.body.doctor.email,
        password: hashedPass,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: userData
        })

        return await tnx.doctor.create({
            data: req.body.doctor
        })

    })

    return result
}

const getAllFromDB = async () => {
    const result = await prisma.user.findMany()
    return result
}



export const UserService = {
    createPatient,
    createDoctor,
    getAllFromDB
}