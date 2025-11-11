import { paginationHelper } from '../../shared/pagination';
import { Prisma, UserRole } from '../../../generated/client';
import { v4 as uuidv4 } from 'uuid';
import { IJWTPayload } from "../../types/common"
import { prisma } from "../../shared/prisma"
import { stripe } from '../../helper/stripe';

const createAppoinment = async(user: IJWTPayload, payload: {doctorId: string, scheduleId: string}) => {

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

    
    const isExist = await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    })
    
    
    const generateVideoCallingId = uuidv4()
    const transactionId = uuidv4()


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


        const paymentData = await tnx.payment.create({
            data: {
                appoinmentId: appoinmentData.id,
                amount: doctorInfo.appointmentFee,
                transactionId: transactionId,

            }
        })


         const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Appointment wiht ${doctorInfo.name}`,
                    },
                    unit_amount: doctorInfo.appointmentFee * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                appoinmentId: appoinmentData.id,
                paymentId: paymentData.id
            },
            success_url: 'https://eng-waliullah.vercel.app',
            cancel_url: 'http://localhost:5000/api/v1/cancel',
        });

        console.log(session);

        return {
            paymentUrl: session.url
        }
    })

    return result
}




const getMyAppoinment = async(user: IJWTPayload, options: any, filters: any) => {{
        const { page, limit, skip, sortBy, sortOrder } = paginationHelper.pagination(options);
        const { ...filterData } = filters;

        const andConditions: Prisma.AppoinmentWhereInput[] = [];
        if (user.role === UserRole.PATIENT) {
            andConditions.push({
                patient: {
                    email: user.email
                }
            })
        } else if (user.role === UserRole.DOCTOR) {
            andConditions.push({
                doctor: {
                    email: user.email
                }
            })
        }

        if(Object.keys(filterData).length > 0) {
            const filterConditions = Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))

            andConditions.push(...filterConditions);
        }

        const whereConditions: Prisma.AppoinmentWhereInput = andConditions.length > 0 ? {AND: andConditions} : {};

        const result = await prisma.appoinment.findMany({
            where: whereConditions,
            skip,
            take: limit,
            // orderBy: {
            //     [sortBy]: sortOrder
            // },
            include: user.role === UserRole.DOCTOR ?
                {patient: true} : {doctor: true}
        });


        const total = await prisma.appoinment.count({
            where: whereConditions
        });

        return {
            meta: {
                total,
                limit,
                page
            },
            data: result
        }
}}


export const AppoinmentServices = {
    createAppoinment,
    getMyAppoinment
}