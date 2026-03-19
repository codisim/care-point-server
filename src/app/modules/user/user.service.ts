import { fileUploder } from "../../helper/fileUploder";
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";

import { Admin, Doctor, Prisma, UserRole, UserStatus } from "../../../generated/client";
import { userSearchableFields } from "./user.contant";
import { paginationHelper } from "../../shared/pagination";
import { IJWTPayload } from "../../types/common";
import { doc } from "prettier";

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


    const {specialties, ...doctorData} = req.body.doctor;


    const result = await prisma.$transaction(async (tnx) => {

        // step: 1
        await tnx.user.create({
            data: userData
        })


        // step: 2
        const createDoctorData = await tnx.doctor.create({
            data: doctorData,
        })

        // step:3 create doctor specialties if provided
        if(specialties && Array.isArray(specialties) && specialties.length > 0){
            const existingAllSpecialties = await tnx.specialties.findMany({
                where: {
                    id: {
                        in: specialties
                    },
                },
            });

            const existingSpecialtiesIds = existingAllSpecialties.map(s => s.id);
            const invalidSpecialties = specialties.filter(s => !existingSpecialtiesIds.includes(s));

            if (invalidSpecialties.length > 0) {
                throw new Error(`Invalid specialties IDs: ${invalidSpecialties.join(', ')}`);
            }

            // create doctor specialties relations
            const doctorSpecialtiesData = specialties.map((specialtyId) => ({
                doctorId: createDoctorData.id,
                specialtyId,
            }));

            await tnx.doctorSpecialties.createMany({
                data: doctorSpecialtiesData,
            });
        }

        // step:4 returns doctor with specialties
        const doctorWithSpecialties = await tnx.doctor.findUnique({
            where: {
                id: createDoctorData.id,
            },
            include: {
                specialties: true,
            },
        });

        return doctorWithSpecialties;   

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

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const result = await prisma.user.findMany({
        skip,
        take: Number(limit),

        where: whereConditions,

        orderBy: {
            [sortBy]: sortOrder
        }
    })

    const total = await prisma.user.count({
        where: whereConditions,

    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}


const getMyProfile = async (user: IJWTPayload) => {

    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true
        }
    })

    let profileData;

    if (userInfo.role === UserRole.PATIENT) {
        profileData = await prisma.patient.findUnique({
            where: {
                email: userInfo.email
            }
        })
    } else if (userInfo.role === UserRole.DOCTOR) {
        profileData = await prisma.doctor.findUnique({
            where: {
                email: userInfo.email
            }
        })
    } else if (userInfo.role === UserRole.ADMIN) {
        profileData = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }

    return {
        ...userInfo,
        ...profileData
    }
}


const changeProfileStatus = async (id: string, payload: { status: UserStatus }) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })

    const updatedUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: payload
    })

    return updatedUserStatus
}


export const UserService = {
    createPatient,
    createDoctor,
    createAdmin,
    getAllFromDB,
    getMyProfile,
    changeProfileStatus
}