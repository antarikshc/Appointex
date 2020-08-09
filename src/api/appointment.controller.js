import Repository from '../core/appointment.repo';

export default class AppointmentController {
  static getAllSlots(req, res, next) {
    const date = new Date(req.body.date);
    const slots = Repository.getAllSlots(date, req.body.timeZoneOffset);

    res.status(200).json(slots);
  }
}
