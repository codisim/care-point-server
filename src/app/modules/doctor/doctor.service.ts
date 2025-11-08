import { Prisma } from "../../../generated/client";
import { paginationHelper } from "../../shared/pagination";
import { doctorSearchableFields } from "./doctor.constant";

const getAllDoctorFromDB = async (filters: any, options: any) => {

    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.pagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        OR: doctorSearchableFields.map((field) => ({
            [field]: {
                contains: searchTerm,
                mode: "insensitive"
            }
        }))
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))

        andConditions.push(...filterConditions);
    }

    return {
        filters, options
    }
}


export const DoctorServices = {
    getAllDoctorFromDB
}