import { validationResult } from 'express-validator';

import Repository from '../core/event.repo';

export default class EventController {
  // Controller for GET /event
  static async getEvents(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const events = await Repository.getEventsBetween(
        req.body.startTime,
        req.body.endTime,
        req.body.timeZoneOffset,
      );

      return res.status(200).json(events);
    } catch (e) {
      console.error(e.stack);
      return res.status(400).json({ error: `${e.name} - ${e.message}` });
    }
  }
}
