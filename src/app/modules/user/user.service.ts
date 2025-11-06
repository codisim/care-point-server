import bcrypt from "bcryptjs";
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { fileUploder } from "../../helper/fileUploder";
import { UserRole } from "../../../generated/enums";
import { Admin, Doctor, Prisma } from "../../../generated/client";
import { paginationHelper } from "../../shared/pagination";
import {  userSearchableFields } from "./user.contant";




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


const createDoctor = async (req: Request): Promise<Doctor> => {

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


const createAdmin = async (req: Request): Promise<Admin> => {

    const file = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploder.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 10)

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });

        return createdAdminData;
    });

    return result;
};


const getAllFromDB = async (params: any, options: any) => {

    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.pagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = []

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                },
            }))
        })
    }

    if(Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const result = await prisma.user.findMany({
        skip,
        take: Number(limit),

        where: {
            AND: andConditions
        },

        orderBy: {
            [sortBy]: sortOrder
        }
    })

    

    return result
}

export const UserService = {
    createPatient,
    createDoctor,
    createAdmin,
    getAllFromDB
}