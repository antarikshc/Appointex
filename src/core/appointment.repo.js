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

    const dateUtc = new Date(time - (timeZoneOffset * MINUTES_TO_MILLIS));

    // Get booked events for rest of the day
    const events = await Dao.getEventsForDay(new Date(time));

    // Filter available slots and map to user's timezone
    const available = this.removeBookedSlots(dateUtc, slots, events).map((item) => {
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
    if (events.length === 0) return slots;
    const result = [];

    let i = 0;
    let j = 0;
    while (i < slots.length && j < events.length) {
      const slot = slots[i];
      const event = events[j];
      if (slot.startTime >= date.getTime()) {
        const eventStart = event.startTime.toMillis();
        const eventEnd = event.endTime.toMillis();
        if (
          (eventStart <= slot.startTime && slot.endTime <= eventEnd) ||
          (slot.startTime <= eventStart && eventStart < slot.endTime) ||
          (slot.startTime < eventEnd && eventEnd <= slot.endTime)
        ) {
          let k = i + 1;
          while (slots[k].startTime < event.endTime) k += 1;
          i = k;
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
