import { Router } from 'express';
import AppointmentCtrl from './appointment.controller';

const router = new Router();

router
  .route('/slots')
  .get(AppointmentCtrl.validateGetAllSlots(), AppointmentCtrl.getAllSlots);

export default router;
