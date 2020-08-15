import { Router } from 'express';
import Controller from './appointment.controller';
import Validator from './appointment.validator';

const router = new Router();

router
  .route('/slots')
  .get(Validator.getAllSlots(), Controller.getAvailableSlots);

router
  .route('/book')
  .post(Validator.bookAppointment(), Controller.bookAppointment);

export default router;
