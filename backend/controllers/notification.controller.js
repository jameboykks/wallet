const { Notification } = require('../models');

exports.list = async (req, res) => {
  const list = await Notification.findAll({
    where: { user_id: req.user.id },
    order: [['created_at', 'DESC']]
  });
  res.json(list);
};

exports.read = async (req, res) => {
  const { id } = req.body;
  const notification = await Notification.findOne({
    where: { id, user_id: req.user.id }
  });
  if (!notification) return res.status(404).json({ message: "Not found" });
  await notification.update({ is_read: true });
  res.json({ message: "Marked as read" });
};
