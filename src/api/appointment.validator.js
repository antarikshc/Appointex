/* eslint-disable newline-per-chained-call */

import { body } from 'express-validator';
import { getStartOfDay } from '../util/time';

export default class AppointmentValidator {
  static getAllSlots() {
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

  static bookAppointment() {
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
