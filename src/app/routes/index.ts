import express from 'express';
import {  userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/user.routes';
import { scheduleRoutes } from '../modules/schedule/schedule.routes';
import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.routes';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.routes';
import { doctorRoutes } from '../modules/doctor/doctor.routes';
import { patientRoutes } from '../modules/patient/patient.routes';


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
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;