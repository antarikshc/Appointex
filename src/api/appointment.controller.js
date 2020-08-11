import { validationResult } from 'express-validator';

import Repository from '../core/appointment.repo';

export default class AppointmentController {
  static async getAvailableSlots(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const slots = await Repository.getAvailableSlots(req.body.date, req.body.timeZoneOffset);

      return res.status(200).json(slots);
    } catch (e) {
      console.error(e.stack);
      return res.status(400).json({ error: `${e.name} - ${e.message}` });
    }
  }

  static async bookAppointment(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await Repository.bookAppointment(req.body);

      return res.status(200).json(result);
    } catch (e) {
      console.error(e.stack);
      return res.status(400).json({ error: `${e.name} - ${e.message}` });
    }
  }
}
