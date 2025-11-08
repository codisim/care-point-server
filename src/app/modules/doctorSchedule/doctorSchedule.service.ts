import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types/common";

const insertIntoDB = async (user: IJWTPayload, payload: {scheduleIds: string[]}) => {
    
    const doctorInfo = await prisma.doctor.findFirstOrThrow({
        where: {
            email: user.email
        }
    });


    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctorInfo.id,
        scheduleId
    }))

    return await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    })
}

export const DoctorScheduleService = {
    insertIntoDB
}