import { prisma } from "../../shared/prisma"

const getAllPatientFromDB = async () => {
    const patients = await prisma.patient.findMany();

    return patients
}


export const PatientServices = {
    getAllPatientFromDB
}