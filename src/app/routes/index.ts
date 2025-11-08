import express from 'express';
import {  userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/user.routes';
import { scheduleRoutes } from '../modules/schedule/schedule.routes';
import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.routes';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/schedule',
        route: scheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes
    }, 
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;