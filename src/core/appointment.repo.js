import * as config from './config';
import Dao from '../data/events.dao';
import { generateSlots, convertUtc, convertTimeZone } from '../util/time';

export default class AppointmentRepository {
  /**
   * Generates all the available slots within config bounds
   * @param {Number} time in millis
   * @param {Minutes} timeZoneOffset in minutes
   *
   * @returns [{ startTime, endTime }] in millis of user requested timeZone
   */
  static async getAvailableSlots(time, timeZoneOffset) {
    // Doctor's slots in UTC for entire day
    const slots = generateSlots(new Date(time), config).map((item) => ({
      startTime: convertUtc(item.startTime, config.timeZoneOffset),
      endTime: convertUtc(item.endTime, config.timeZoneOffset),
    }));

    const dateUtc = new Date(convertUtc(time, timeZoneOffset));

    // Get booked events for rest of the day
    const events = await Dao.getEventsForDay(new Date(time));

    // Filter available slots and map to user's timezone
    const available = this.removeBookedSlots(dateUtc, slots, events).map((item) => ({
      startTime: convertTimeZone(item.startTime, timeZoneOffset),
      endTime: convertTimeZone(item.endTime, timeZoneOffset),
    }));

    return available;
  }

  /**
   * Books an Appointment and returns the UUID
   * @param {Event} data Event Object
   */
  static async bookAppointment(data) {
    const event = data;

    event.startTime = convertUtc(data.startTime, data.timeZoneOffset);
    event.endTime = convertUtc(data.endTime, data.timeZoneOffset);

    const result = await Dao.addEvent(event);

    return result;
  }

  /**
   * Util method for Filtering booked slots
   * @param {Date} date
   * @param { { startTime, endTime }[] } slots
   * @param { Event[] } events
   */
  static removeBookedSlots(date, slots, events) {
    if (events.length === 0) return slots;

    const result = [];

    let i = 0;
    let j = 0;
    while (i < slots.length && j < events.length) {
      const slot = slots[i];
      const event = events[j];
      const eventStart = event.startTime.toMillis();
      const eventEnd = event.endTime.toMillis();

      if (eventStart < slot.startTime && eventEnd <= slot.startTime) {
        j += 1;
      } else {
        if (slot.startTime >= date.getTime()) {
          if (
            (eventStart <= slot.startTime && slot.endTime <= eventEnd) ||
            (slot.startTime <= eventStart && eventStart < slot.endTime) ||
            (slot.startTime < eventEnd && eventEnd <= slot.endTime)
          ) {
            let k = i + 1;
            while (slots[k].startTime < event.endTime && k < slots.length) k += 1;
            i = k - 1;
            j += 1;
          } else {
            result.push(slot);
          }
        }
        i += 1;
      }
    }

    while (i < slots.length) {
      result.push(slots[i]);
      i += 1;
    }

    return result;
  }
}
