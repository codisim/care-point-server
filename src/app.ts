import { AppoinmentServices } from './app/modules/appoinment/appoinment.service';
import { PaymentController } from './app/modules/payment/payment.controller';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import cookieParser from "cookie-parser"
import notFound from './app/middlewares/notFound';
import config from './config';
import router from './app/routes';
import cors from 'cors';
import cron from 'node-cron';

const app: Application = express();


// Stripe Webhook endpoint
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
)


// Schedule a cron job to run every minute
cron.schedule('* * * * *', () => {
  try {
    AppoinmentServices.cancelUnpaidAppoinment();
  } catch (error) {
    console.error(error)
  }

});


// CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


//parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1", router);



app.get('/', (req: Request, res: Response) => {
  res.send({
    message: "Server is running..",
    environment: config.node_env,
    uptime: process.uptime().toFixed(2) + " sec",
    timeStamp: new Date().toISOString()
  })
});


app.use(globalErrorHandler);

app.use(notFound);

export default app;