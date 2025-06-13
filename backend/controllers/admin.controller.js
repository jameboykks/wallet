const { User, Transaction, Notification } = require('../models');
const { Op, fn, col } = require('sequelize');

exports.getUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'username', 'email', 'full_name', 'balance', 'is_locked', 'created_at']
  });
  res.json(users);
};

exports.lockUser = async (req, res) => {
  const { user_id } = req.body;
  const user = await User.findByPk(user_id);
  if (!user) return res.status(404).json({ message: "User not found" });
  await user.update({ is_locked: true });
  res.json({ message: "User locked" });
};

exports.unlockUser = async (req, res) => {
  const { user_id } = req.body;
  const user = await User.findByPk(user_id);
  if (!user) return res.status(404).json({ message: "User not found" });
  await user.update({ is_locked: false });
  res.json({ message: "User unlocked" });
};

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.findAll({
    include: [
      { model: User, as: 'relatedUser', attributes: ['id', 'username'] }
    ],
    order: [['created_at', 'DESC']]
  });
  res.json(transactions);
};

exports.statistics = async (req, res) => {
  // Tổng tiền hệ thống
  const total = await User.sum('balance');
  // 5 giao dịch nổi bật nhất (giao dịch lớn nhất)
  const top = await Transaction.findAll({
    order: [['amount', 'DESC']],
    limit: 5
  });
  res.json({ total, top });
};

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.findAll({
    order: [['created_at', 'DESC']],
    limit: 100
  });
  res.json(notifications);
};
