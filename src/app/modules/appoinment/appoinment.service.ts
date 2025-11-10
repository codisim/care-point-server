import { v4 as uuidv4 } from 'uuid';
import { IJWTPayload } from "../../types/common"
import { prisma } from "../../shared/prisma"

const createAppoinment = async(user: IJWTPayload, payload: {doctorId: string, scheduleId: string}) => {
    console.log(user);

    const patientInfo = await prisma.patient.findFirstOrThrow({
        where: {
            email: user.email
        }
    })


    const doctorInfo = await prisma.doctor.findFirstOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    })

        console.log(patientInfo.id, doctorInfo.id);
    
    const isExist = await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    })
    
    
    const generateVideoCallingId = uuidv4()
    
    console.log(patientInfo.id, doctorInfo.id,  generateVideoCallingId);


    const result = await prisma.$transaction(async(tnx) => {
        const appoinmentData = await tnx.appoinment.create({
            data: {
                patientId: patientInfo.id,
                doctorId: doctorInfo.id,
                scheduleId: isExist.scheduleId,
                videoCallingId: generateVideoCallingId
            }
        })

        await tnx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorInfo.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true
            }
        })

        return appoinmentData

    })
    

    return result

}

export const AppoinmentServices = {
    createAppoinment
}