/**
 * Returns the 00:00 time of given date in Millis
 * @param {Date} date
 */
function getStartOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Returns the 23:59 time of given date in Millis
 * @param {Date} date
 */
function getEndOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

/**
 * Generates [] of { start, end } in millis
 * Add this value to 'millis of any given Date object with time 00:00' to get start and end dates
 * @param {Date} date
 * @param {Config} config
 */
function generateSlots(date, config) {
  const slots = [];
  const millis = 60 * 1000;

  const prefix = getStartOfDay(date).getTime();

  for (
    let start = config.clockIn;
    start + config.duration <= config.clockOut;
    start += config.duration
  ) {
    const startTime = prefix + (start * millis);
    const endTime = startTime + (config.duration * millis);
    slots.push({ startTime, endTime });
  }

  return slots;
}

function convertUtc(time, timeZoneOffset) {
  if (timeZoneOffset) {
    return time - (timeZoneOffset * 60 * 1000);
  }
  return time;
}

function convertTimeZone(time, timeZoneOffset) {
  if (timeZoneOffset) {
    return time + (timeZoneOffset * 60 * 1000);
  }
  return time;
}

module.exports = {
  getStartOfDay,
  getEndOfDay,
  generateSlots,
  convertUtc,
  convertTimeZone,
};
