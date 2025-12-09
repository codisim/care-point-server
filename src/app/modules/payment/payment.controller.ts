import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { stripe } from "../../helper/stripe";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import httpStatus from 'http-status';

const handleStripeWebhookEvent = catchAsync(async(req: Request, res: Response) => {

    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = "whsec_f69090c1a9133e62459850854589d4df72210c4f3bbd2b348586b0303ca53d79";

    let event;
    try{
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch(err: any) {
        return res.status(httpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`)
    } 

    const result = await PaymentService.handleStripeWebhookEvent(event);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Webhook req send successfully....!",
        data: result
    })
})



export const PaymentController = {
    handleStripeWebhookEvent
}