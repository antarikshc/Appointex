import { firestore } from 'firebase-admin';
import * as config from './config';
import Dao from '../data/events.dao';
import { generateSlots } from '../util/time';

const MINUTES_TO_MILLIS = 60 * 1000;

export default class AppointmentRepository {
  /**
   * Returns all the available slots within config bounds
   * @param {Number} time in millis
   * @param {Minutes} timeZoneOffset in minutes
   *
   * @returns [{ startTime, endTime }] in millis of user requested timeZone
   */
  static async getAvailableSlots(time, timeZoneOffset) {
    // Doctor's slots in UTC for entire day
    const slots = generateSlots(new Date(time), config).map((item) => {
      let { startTime, endTime } = item;

      // convert to UTC
      startTime = item.startTime - (config.timeZoneOffset * MINUTES_TO_MILLIS);
      endTime = item.endTime - (config.timeZoneOffset * MINUTES_TO_MILLIS);

      return { startTime, endTime };
    });

    const date = new Date(time - timeZoneOffset * MINUTES_TO_MILLIS);

    // Get booked events for rest of the day
    const events = await Dao.getEventsForDay(date);

    // Filter available slots and map to user's timezone
    const available = this.removeBookedSlots(date, slots, events).map((item) => {
      let { startTime, endTime } = item;

      // convert to user's requested timeZone
      startTime += timeZoneOffset * MINUTES_TO_MILLIS;
      endTime += timeZoneOffset * MINUTES_TO_MILLIS;

      return { startTime, endTime };
    });

    return available;
  }

  static async bookAppointment(data) {
    const event = data;

    let startInMillis = data.startTime;
    let endInMillis = data.endTime;

    if (data.timeZoneOffset) {
      startInMillis -= data.timeZoneOffset * MINUTES_TO_MILLIS;
      endInMillis -= data.timeZoneOffset * MINUTES_TO_MILLIS;
    }

    event.startTime = firestore.Timestamp.fromMillis(startInMillis);
    event.endTime = firestore.Timestamp.fromMillis(endInMillis);

    const result = await Dao.addEvent(event);

    return result;
  }

  static removeBookedSlots(date, slots, events) {
    const result = [];

    let i = 0;
    let j = 0;
    while (i < slots.length && j < events.length) {
      const slot = slots[i];
      const event = events[j];
      if (slot.startTime >= date.getTime()) {
        if (
          slot.startTime >= event.startTime.toMillis() &&
          slot.startTime < event.endTime.toMillis()
        ) {
          let k = i + 1;
          while (slots[k].startTime < event.endTime) k += 1;
          i = k - 1;
          j += 1;
        } else {
          result.push(slot);
        }
      }
      i += 1;
    }

    return result;
  }
}
