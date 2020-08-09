import { Router } from 'express';
import AppointmentCtrl from './appointment.controller';

const router = new Router();

router.route('/slots').get(AppointmentCtrl.getAllSlots);

export default router;
