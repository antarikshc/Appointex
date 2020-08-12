/* eslint-disable newline-per-chained-call */

import { body } from 'express-validator';
import { getStartOfDay, convertUtc } from '../util/time';
import * as config from '../core/config';
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
        .custom(this.checkForFutureDate),
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
        .custom((value) => this.checkForFutureDate(value)),
      body('endTime')
        .exists().withMessage(NOT_NULL)
        .isInt().withMessage(MUST_BE_NUMBER),
      body('timeZoneOffset')
        .optional()
        .isInt().withMessage(MUST_BE_NUMBER),
      body().custom(this.customBookAppointment),
    ];
  }

  static checkForFutureDate(value) {
    const time = getStartOfDay(new Date()).getTime();
    if (value < time) {
      throw new Error('Provide future date');
    }
    return true;
  }

  static async customBookAppointment(item) {
    if (item.endTime <= item.startTime) {
      throw new Error('endTime should be greater than startTime');
    }

    const startUtc = convertUtc(item.startTime, item.timeZoneOffset);
    const endUtc = convertUtc(item.endTime, item.timeZoneOffset);

    const prefix = getStartOfDay(new Date(item.startTime)).getTime();
    const configStart = prefix + (config.clockIn * 60 * 1000);
    const configEnd = prefix + (config.clockOut * 60 * 1000);

    if (startUtc < configStart || endUtc > configEnd) {
      throw new Error('No slot available');
    }

    const collision = await Dao.checkEventCollision(
      item.startTime,
      item.endTime,
      item.timeZoneOffset,
    );
    if (collision) {
      throw new Error('The time slot is already booked');
    }

    return true;
  }
}
