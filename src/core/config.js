import 'dotenv/config';

/**
 * Returns the default config for bounds
 * All fields are in Minutes
 */
module.exports = {
  clockIn: parseInt(process.env.CONFIG_CLOCK_IN, 10) || 9 * 60,
  clockOut: parseInt(process.env.CONFIG_CLOCK_OUT, 10) || 17 * 60,
  duration: parseInt(process.env.CONFIG_DURATION, 10) || 30,
  timeZoneOffset: parseInt(process.env.CONFIG_TIME_ZONE, 10) || 5.5 * 60, // India = +5:30
};
