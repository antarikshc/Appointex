/* eslint-disable newline-per-chained-call */

import { body, validationResult } from 'express-validator';
import { getStartOfDay } from '../util/time';
import Repository from '../core/appointment.repo';

export default class AppointmentController {
  static getAllSlots(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const date = new Date(req.body.date);
    const slots = Repository.getAllSlots(date, req.body.timeZoneOffset);

    return res.status(200).json(slots);
  }

  static validateGetAllSlots() {
    return [
      body('date')
        .exists().withMessage('must not be null')
        .isInt().withMessage('must be a number')
        .custom((value) => {
          const time = getStartOfDay(new Date());
          if (value < time) {
            throw new Error('Provide future date');
          }
          return true;
        }),
      body('timeZoneOffset')
        .exists().withMessage('must not be null')
        .isInt().withMessage('must be a number'),
    ];
  }
}
