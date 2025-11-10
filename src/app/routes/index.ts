import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.routes';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.routes';
import { appoinmentRoutes } from '../modules/appoinment/appoinment.rotes';
import { scheduleRoutes } from '../modules/schedule/schedule.routes';
import { patientRoutes } from '../modules/patient/patient.routes';
import { doctorRoutes } from '../modules/doctor/doctor.routes';
import {  userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/user.routes';
import express from 'express';

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
    {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
    {
        path: '/doctor',
        route: doctorRoutes
    },
    {
        path: '/patient',
        route: patientRoutes
    },
    {
        path: '/appoinment',
        route: appoinmentRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;