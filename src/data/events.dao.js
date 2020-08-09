import getDatabase from '../util/firestore.init';

const db = getDatabase();

export default class EventsDao {
  static async getEvents() {
    let events = [];
    try {
      const snap = await db.collection('events').get();
      events = snap.docs.map((item) => item.data());
    } catch (e) {
      console.error(`getEvents : ${e.stack}`);
    }
    return events;
  }
}
