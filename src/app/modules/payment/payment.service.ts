import { PaymentStatus } from "../../../generated/enums";
import { prisma } from "../../shared/prisma";
import Stripe from "stripe";

const handleStripeWebhookEvent = async(event : Stripe.Event) => {
    switch(event.type){
        case "checkout.session.completed": {
            const session = event.data.object as any;

            const appoinmentId = session.metadata?.appoinmentId;
            const paymentId = session.metadata?.paymentId;
            const email = session.customer_email;

            await prisma.appoinment.update({
                where: {
                    id: appoinmentId
                },
                data: {
                    paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID
                }
            })

            await prisma.payment.update({
                where:{
                    id: paymentId
                },
                data: {
                    status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
                    paymentGateWayData: session
                }
            })

            break;
        }

        // case "payment_intent.payment_failed": {
        //     const intent = event.data.object as any;
        //     await prisma.payment.update({
        //         where:{
        //             id: paymentId
        //         },
        //         data: {
        //             status: PaymentStatus.UNPAID,
        //         }
        //     })

        //     break;
        // }

        default: 
            console.log(`Unhandled event type: ${event.type}` );
    }
}


export const PaymentService = {
    handleStripeWebhookEvent
}