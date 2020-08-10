/* eslint-disable newline-per-chained-call */

import { body, validationResult } from 'express-validator';
import { getStartOfDay } from '../util/time';
import Repository from '../core/appointment.repo';

export default class AppointmentController {
  static getAllSlots(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const date = new Date(req.body.date);
      const slots = Repository.getAllSlots(date, req.body.timeZoneOffset);

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

  /**
   * Validation methods
   */

  static validateGetAllSlots() {
    return [
      body('date')
        .exists().withMessage('must not be null')
        .isInt().withMessage('must be a number')
        .custom((value) => {
          const time = getStartOfDay(new Date()).getTime();
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

  static validateBookAppointment() {
    return [
      body('name')
        .exists().withMessage('must not be null')
        .isString().withMessage('must be a string'),
      body('startTime')
        .exists().withMessage('must not be null')
        .isInt().withMessage('must be a number')
        .custom((value) => {
          const time = getStartOfDay(new Date()).getTime();
          if (value < time) {
            throw new Error('Provide future date');
          }
          return true;
        }),
      body('endTime')
        .exists().withMessage('must not be null')
        .isInt().withMessage('must be a number')
        .custom((value, { req }) => {
          if (value <= req.body.startTime) {
            throw new Error('endTime should be greater than startTime');
          }
          return true;
        }),
      body('timeZoneOffset')
        .optional()
        .isInt().withMessage('must be a number'),
    ];
  }
}
