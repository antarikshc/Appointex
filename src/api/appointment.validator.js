/* eslint-disable newline-per-chained-call */

import { body } from 'express-validator';
import { getStartOfDay } from '../util/time';
import Dao from '../data/events.dao';

const NOT_NULL = 'must not be null';
const MUST_BE_NUMBER = 'must be a number';
const MUST_BE_STRING = 'must be a string';

export default class AppointmentValidator {
  static getAllSlots() {
    return [
      body('date')
        .exists().withMessage(NOT_NULL)
        .isInt().withMessage(MUST_BE_NUMBER)
        .custom((value) => {
          const time = getStartOfDay(new Date()).getTime();
          if (value < time) {
            throw new Error('Provide future date');
          }
          return true;
        }),
      body('timeZoneOffset')
        .exists().withMessage(NOT_NULL)
        .isInt().withMessage(MUST_BE_NUMBER),
    ];
  }

  static bookAppointment() {
    return [
      body('name')
        .exists().withMessage(NOT_NULL)
        .isString().withMessage(MUST_BE_STRING),
      body('startTime')
        .exists().withMessage(NOT_NULL)
        .isInt().withMessage(MUST_BE_NUMBER)
        .custom((value) => {
          const time = getStartOfDay(new Date()).getTime();
          if (value < time) {
            throw new Error('Provide future date');
          }
          return true;
        }),
      body('endTime')
        .exists().withMessage(NOT_NULL)
        .isInt().withMessage(MUST_BE_NUMBER)
        .custom(async (value, { req }) => {
          if (value <= req.body.startTime) {
            throw new Error('endTime should be greater than startTime');
          }

          const collision = await Dao.checkEventCollision(
            req.body.startTime,
            req.body.endTime,
            req.body.timeZoneOffset,
          );
          if (collision) {
            throw new Error('The time slot is already booked');
          }

          return true;
        }),
      body('timeZoneOffset')
        .optional()
        .isInt().withMessage(MUST_BE_NUMBER),
    ];
  }
}
