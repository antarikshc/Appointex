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
      events = snap.docs.map((item) => this.dataToEvent(item.data()));
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

      events = snap.docs.map((item) => this.dataToEvent(item.data()));
    } catch (e) {
      console.error(`getEventsForDay : ${e.stack}`);
    }

    return events;
  }

  static async checkEventCollision(startTime, endTime, timeZoneOffset) {
    try {
      let startInMillis = startTime;
      let endInMillis = endTime;

      if (timeZoneOffset) {
        startInMillis -= timeZoneOffset * (60 * 1000);
        endInMillis -= timeZoneOffset * (60 * 1000);
      }

      const start = new Date(startInMillis);
      const end = new Date(endInMillis);

      const startCollisonQuery = await db.collection('events')
        .where('startTime', '>=', start)
        .where('startTime', '<', end)
        .get();

      const endCollisonQuery = await db.collection('events')
        .where('endTime', '>', start)
        .where('endTime', '<=', end)
        .get();

      if (startCollisonQuery.docs.length > 0 || endCollisonQuery.docs.length > 0) {
        return true;
      }
    } catch (e) {
      console.error(`checkEventCollision : ${e.stack}`);
    }

    return false;
  }

  /**
   * Add event to DB
   * @param {Object} event
   * @returns {string?} ID of document
   */
  static async addEvent(event) {
    try {
      const item = event;
      delete item.timeZoneOffset;
      const docRef = await db.collection('events').add(item);
      const doc = await docRef.get();

      const result = this.dataToEvent(doc.data());
      result.id = doc.id;

      return result;
    } catch (e) {
      console.error(`addEvent : ${e.stack}`);
      return null;
    }
  }

  static dataToEvent(data) {
    const event = data;
    event.startTime = data.startTime.toMillis();
    event.endTime = data.endTime.toMillis();

    return event;
  }
}
