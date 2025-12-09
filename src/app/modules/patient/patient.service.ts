import { paginationHelper } from "../../shared/pagination";
import { IJWTPayload } from "../../types/common";
import { prisma } from "../../shared/prisma"

const getAllPatientFromDB = async (options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.pagination(options);

    const patients = await prisma.patient.findMany({
        skip,
        take: Number(limit),
        orderBy: {
            [sortBy]: sortOrder
        }

    });

    const total = await prisma.patient.count()

    return {
        meta: {
            page,
            limit,
            total
        },
        data: patients
    }
}


const getSinglePatinetFromDB = async (id: string) => {
    const patient = await prisma.patient.findFirstOrThrow({
        where: {
            id
        }
    })

    return patient
}



export const updateIntoDB = async(user: IJWTPayload, payload: any) => {
    const {medicalReport, patientHealthData, ...patientData} = payload;

    const patientInfo = await prisma.patient.findUniqueOrThrow({
            where: {
                email: user.email,
                isDeleted: false
            }
    });

    return await prisma.$transaction(async(tnx) => {

        await tnx.patient.update({
            where: {
                id: patientInfo.id
            },
            data: patientData
        })

        if (patientHealthData) {
        await tnx.patientHealthData.upsert({
            where: {
                patientId: patientInfo.id
            },
            update: patientHealthData,
            create: {
                ...patientHealthData,
                patientId: patientInfo.id
            }
        })
    }

        if (medicalReport) {
            await tnx.medicalReport.create({
                data: {
                    ...medicalReport,
                    patientId: patientInfo.id
                }
            })
        }
    

        const result = await tnx.patient.findUnique({
            where: {
                id: patientInfo.id
            },
            include: {
                patientHealthData: true,
                medicalReports: true
            }
        })
        
        return result
     })
    
}



export const PatientServices = {
    getAllPatientFromDB,
    getSinglePatinetFromDB,
    updateIntoDB
}