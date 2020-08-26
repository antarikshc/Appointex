/* eslint-disable newline-per-chained-call */

import { body } from 'express-validator';

const NOT_NULL = 'must not be null';
const MUST_BE_NUMBER = 'must be a number';

export default class EventsValidator {
  static getEvents() {
    return [
      body('startTime')
        .exists().withMessage(NOT_NULL)
        .isInt().withMessage(MUST_BE_NUMBER),
      body('endTime')
        .exists().withMessage(NOT_NULL)
        .isInt().withMessage(MUST_BE_NUMBER),
      body('timeZoneOffset')
        .optional()
        .isInt().withMessage(MUST_BE_NUMBER),
    ];
  }
}
