import { firestore } from 'firebase-admin';
import * as config from './config';
import Dao from '../data/events.dao';
import { generateSlots } from '../util/time';

const MINUTES_TO_MILLIS = 60 * 1000;

export default class AppointmentRepository {
  /**
   * Generates all the available slots within config bounds
   * @param {Date} date
   * @param {Minutes} timeZoneOffset
   *
   * @returns [{ startTime, endTime }] in millis of user requested timeZone
   */
  static getAllSlots(date, timeZoneOffset) {
    return generateSlots(date, config)
      .map((item) => {
        let { startTime, endTime } = item;

        // convert to UTC
        startTime = item.startTime - (config.timeZoneOffset * MINUTES_TO_MILLIS);
        endTime = item.endTime - (config.timeZoneOffset * MINUTES_TO_MILLIS);

        // convert to user's requested timeZone
        startTime += timeZoneOffset * MINUTES_TO_MILLIS;
        endTime += timeZoneOffset * MINUTES_TO_MILLIS;

        return { startTime, endTime };
      });
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
}
