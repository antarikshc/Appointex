import Dao from '../data/events.dao';
import { convertUtc, convertTimeZone } from '../util/time';

export default class EventRepository {
  /**
   * Queries all events between startTime & endTime
   * @param {Number} startTime in millis
   * @param {Number} endTime in millis
   * @param {Minutes} timeZoneOffset in minutes
   *
   * @returns Event[] in millis of user requested timeZone
   */
  static async getEventsBetween(startTime, endTime, timeZoneOffset) {
    const startUtc = convertUtc(startTime, timeZoneOffset);
    const endUtc = convertUtc(endTime, timeZoneOffset);

    const events = await Dao.getEventsWithBounds(new Date(startUtc), new Date(endUtc));

    return events.map((item) => ({
      startTime: convertTimeZone(item.startTime.toMillis(), timeZoneOffset),
      endTime: convertTimeZone(item.endTime.toMillis(), timeZoneOffset),
    }));
  }
}
