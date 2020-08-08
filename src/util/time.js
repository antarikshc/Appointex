/**
 * Returns the 00:00 time of given date in Millis
 * @param {Date} date
 */
function getStartOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
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

  const prefix = getStartOfDay(date);

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

module.exports = {
  getStartOfDay,
  generateSlots,
};
