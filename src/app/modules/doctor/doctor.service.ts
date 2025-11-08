import { prisma } from "../../shared/prisma";
import { Doctor, Prisma } from "../../../generated/client";
import { paginationHelper } from "../../shared/pagination";
import { doctorSearchableFields } from "./doctor.constant";
import { IDoctorUpdateInput } from "./doctor.interface";

const getAllDoctorFromDB = async (filters: any, options: any) => {

    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.pagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))

        andConditions.push(...filterConditions);
    }

    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    })

    const total = await prisma.doctor.count({
        where: whereConditions
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}


const updateDoctorProfile = async (id: string, payload: Partial<IDoctorUpdateInput>) => {

    // check existing dortor
    const doctorInfo = await prisma.doctor.findFirstOrThrow({
        where: {
            id
        }
    })

    const { specialties, ...doctorData } = payload;

    return await prisma.$transaction(async (tnx) => {
        if (specialties && specialties.length > 0) {

            // all deleted specialties
            const deleteSpecialtyIds = specialties.filter((specialty) => specialty.isDeleted);

            // deleted from existing data
            for (const specialty of deleteSpecialtyIds) {
                await tnx.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: id,
                        specialitiesId: specialty.specialtyId
                    }
                })
            }


            // all added specialties
            const createSpecialtyIds = specialties.filter((specialty) => !specialty.isDeleted);

            // added into existing data
            for (const specialty of createSpecialtyIds) {
                await tnx.doctorSpecialties.create({
                    data: {
                        doctorId: id,
                        specialitiesId: specialty.specialtyId
                    }
                })
            }

        }

        // update doctor info --> doctor -> doctorSpecialties -> specialities
        const updatedData = await tnx.doctor.update({
            where: {
                id: doctorInfo.id
            },
            data: doctorData,

            // include inner data
            include: {
                doctorSpecialties: {
                    include: {
                        specialities: true
                    }
                }
            }
        })

        return updatedData
    })
}

export const DoctorServices = {
    getAllDoctorFromDB,
    updateDoctorProfile
}
