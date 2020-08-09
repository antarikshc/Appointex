import getDatabase from '../util/firestore.init';
import { getStartOfDay, getEndOfDay } from '../util/time';

const db = getDatabase();

export default class EventsDao {
  /**
   * Queries all the events from DB
   */
  static async getEvents() {
    let events = [];

    try {
      const snap = await db.collection('events').get();
      events = snap.docs.map((item) => item.data());
    } catch (e) {
      console.error(`getEvents : ${e.stack}`);
    }

    return events;
  }

  /**
   * Queries all events for Single day
   * @param {Date} date
   */
  static async getEventsForDay(date) {
    let events = [];

    try {
      const start = getStartOfDay(date);
      const end = getEndOfDay(date);

      const snap = await db.collection('events')
        .where('startTime', '>=', start)
        .where('startTime', '<=', end)
        .get();

      events = snap.docs.map((item) => item.data());
    } catch (e) {
      console.error(`getEvents : ${e.stack}`);
    }

    return events;
  }
}
