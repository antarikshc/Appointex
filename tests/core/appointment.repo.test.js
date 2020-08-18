/* eslint-disable no-undef */

import { firestore } from 'firebase-admin';
import { v4 as uuid } from 'uuid';
import Repo from '../../src/core/appointment.repo';
import Dao from '../../src/data/events.dao';

test('should generate available slots from given time onwards', async () => {
  expect.assertions(1);

  // Mock required Dao methods
  Dao.getEventsForDay = jest.fn().mockReturnValue([
    {
      name: 'Event 1',
      startTime: firestore.Timestamp.fromMillis(1597352400000), // 2020/08/14 08:00 IST
      endTime: firestore.Timestamp.fromMillis(1597356000000), // 2020/08/14 09:00 IST
    },
    {
      name: 'Event 2',
      startTime: firestore.Timestamp.fromMillis(1597356000000), // 2020/08/14 09:00 IST
      endTime: firestore.Timestamp.fromMillis(1597358400000), // 2020/08/14 09:40 IST
    },
    {
      name: 'Event 3',
      startTime: firestore.Timestamp.fromMillis(1597365000000), // 2020/08/14 11:30 IST
      endTime: firestore.Timestamp.fromMillis(1597366800000), // 2020/08/14 12:00 IST
    },
  ]);

  const slots = [
    { startTime: 1597379400000, endTime: 1597381200000 },
    { startTime: 1597381200000, endTime: 1597383000000 },
    { startTime: 1597383000000, endTime: 1597384800000 },
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

  const actual = await Repo.getAvailableSlots(1597379400000, 330);
  expect(actual).toEqual(slots);
});

test('should return empty array given out of bounds time', async () => {
  expect.assertions(1);

  // Mock required Dao methods
  Dao.getEventsForDay = jest.fn().mockReturnValue([]);

  const actual = await Repo.getAvailableSlots(1597413600000, 330);
  expect(actual).toEqual([]);
});

test('should convert time to UTC & add event when provided data in diff timezone', async () => {
  expect.assertions(1);

  const id = uuid();

  // Mock Dao method
  Dao.addEvent = jest.fn().mockImplementation(async (data) => {
    const item = data;
    item.id = id;
    delete item.timeZoneOffset;
    return item;
  });

  const data = {
    name: 'Event 1',
    startTime: 1597381200000,
    endTime: 1597383000000,
    timeZoneOffset: 330, // IST
  };

  const expected = {
    id,
    name: data.name,
    startTime: 1597361400000, // UTC
    endTime: 1597363200000, // UTC
  };

  const actual = await Repo.bookAppointment(data);
  expect(actual).toStrictEqual(expected);
});

test('should return null when given bad params to book appointment', async () => {
  expect.assertions(1);

  // Mock Dao method
  Dao.addEvent = jest.fn().mockImplementation(async (data) => data);

  const actual = await Repo.bookAppointment(null);
  expect(actual).toBeFalsy();
});
