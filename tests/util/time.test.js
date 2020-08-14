/* eslint-disable no-undef */

const time = require('../../src/util/time');
const config = require('../../src/core/config');

test('should return midnight time on providing any time of the day', () => {
  expect(time.getStartOfDay(new Date(1597379400000))).toStrictEqual(new Date(1597343400000));
});

test('should return end of the day time on providing any time of the day', () => {
  expect(time.getEndOfDay(new Date(1597343400000))).toStrictEqual(new Date(1597429799999));
});

test('should generate all time slots on providing the config', () => {
  const slots = [
    { startTime: 1597375800000, endTime: 1597377600000 },
    { startTime: 1597377600000, endTime: 1597379400000 },
    { startTime: 1597379400000, endTime: 1597381200000 },
    { startTime: 1597381200000, endTime: 1597383000000 },
    { startTime: 1597383000000, endTime: 1597384800000 },
    { startTime: 1597384800000, endTime: 1597386600000 },
    { startTime: 1597386600000, endTime: 1597388400000 },
    { startTime: 1597388400000, endTime: 1597390200000 },
    { startTime: 1597390200000, endTime: 1597392000000 },
    { startTime: 1597392000000, endTime: 1597393800000 },
    { startTime: 1597393800000, endTime: 1597395600000 },
    { startTime: 1597395600000, endTime: 1597397400000 },
    { startTime: 1597397400000, endTime: 1597399200000 },
    { startTime: 1597399200000, endTime: 1597401000000 },
    { startTime: 1597401000000, endTime: 1597402800000 },
    { startTime: 1597402800000, endTime: 1597404600000 },
  ];

  expect(time.generateSlots(new Date(1597343400000), config)).toStrictEqual(slots);
});

test('should convert to UTC given millis and timezone offset', () => {
  expect(time.convertUtc(1597397400000, 330)).toBe(1597377600000);
});

test('should return same time given time in UTC', () => {
  expect(time.convertUtc(1597397400000)).toBe(1597397400000);
});

test('should convert timezone given millis and timezone offset', () => {
  expect(time.convertTimeZone(1597375800000, 390)).toBe(1597399200000);
});

test('should return same time given time in same timezone', () => {
  expect(time.convertTimeZone(1597375800000)).toBe(1597375800000);
});
