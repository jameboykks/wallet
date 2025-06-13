import { Notification } from "../models/notification.model.js";

export const NotificationController = {
  async list(req, res) {
    const noti = await Notification.findByUser(req.user.id);
    res.json(noti);
  }
};
