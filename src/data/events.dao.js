import getDatabase from '../util/firestore.init';
import { getStartOfDay, getEndOfDay } from '../util/time';
import { removeDuplicates, compareEvents } from '../util/arrays';

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
      const end = getEndOfDay(date);

      const startTimeQuery = await db.collection('events')
        .where('startTime', '>=', date)
        .where('startTime', '<=', end)
        .orderBy('startTime')
        .get();

      const endTimeQuery = await db.collection('events')
        .where('endTime', '>=', date)
        .where('endTime', '<=', end)
        // .orderBy('startTime')
        .get();

      // Sort endTime array because Firestore doesn't support orderBy for different fields
      endTimeQuery.docs.sort(compareEvents);

      events = removeDuplicates(
        startTimeQuery ? startTimeQuery.docs : [],
        endTimeQuery ? endTimeQuery.docs : [],
      );
    } catch (e) {
      console.error(`getEventsForDay : ${e.stack}`);
    }

    return events;
  }

  /**
   * Queries events which might collide with the timings given
   * @param {number} startTime in millis UTC
   * @param {number} endTime in millis UTC
   * @param {number} timeZoneOffset in minutes
   * @returns {Boolean} to indicate whether collision occurs
   */
  static async checkEventCollision(startTime, endTime) {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);

      // There are 4 possibilities
      // Intended booking:           |------------|
      // 4 Posibilities:
      //                  |______1____| |__2__| |______3______|
      //                         |_________4__________|

      // Covers 1st & 2nd posibilities
      const startCollisonQuery = await db.collection('events')
        .where('startTime', '>=', start)
        .where('startTime', '<', end)
        .get();

      // Covers 2nd & 3rd posibilities
      const endCollisonQuery = await db.collection('events')
        .where('endTime', '>', start)
        .where('endTime', '<=', end)
        .get();

      // Covers 4th posibility
      // Here we assume that booking cannot overlap 2 days,
      // so lower limit is start of the day
      const startOfDay = getStartOfDay(start);
      const startEndCollisonQuery = await db.collection('events')
        .where('startTime', '<', start)
        .where('startTime', '>=', startOfDay)
        .get();

      const startEndCollisonDocs = startEndCollisonQuery.docs.filter((doc) => {
        if (doc.data().endTime.toMillis() > endTime) {
          return true;
        }
        return false;
      });

      if (
        startCollisonQuery.docs.length > 0 ||
        endCollisonQuery.docs.length > 0 ||
        startEndCollisonDocs.length > 0
      ) {
        return true;
      }
    } catch (e) {
      console.error(`checkEventCollision : ${e.stack}`);
      return true;
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
