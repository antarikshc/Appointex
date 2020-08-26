import 'dotenv/config';

/**
 * Returns the default config for bounds
 * All fields are in Minutes
 */
module.exports = {
  clockIn: process.env.CONFIG_CLOCK_IN || 9 * 60,
  clockOut: process.env.CONFIG_CLOCK_OUT || 17 * 60,
  duration: process.env.CONFIG_DURATION || 30,
  timeZoneOffset: process.env.CONFIG_TIME_ZONE || 5.5 * 60, // India = +5:30
};
