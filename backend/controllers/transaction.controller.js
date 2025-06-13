const { User, Transaction, Notification } = require('../models');
const { Op } = require('sequelize');

exports.deposit = async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });
  await req.user.update({ balance: Number(req.user.balance) + Number(amount) });
  await Transaction.create({
    user_id: req.user.id,
    type: 'deposit',
    amount,
    status: 'completed',
    description: 'Nạp tiền vào ví'
  });
  await Notification.create({
    user_id: req.user.id,
    type: 'deposit',
    message: `Nạp thành công ${amount} vào ví.`
  });
  res.json({ message: "Deposit successful", newBalance: req.user.balance });
};

exports.transfer = async (req, res) => {
  const { to, amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  // Tìm receiver theo username hoặc email
  const receiver = await User.findOne({
    where: {
      [Op.or]: [
        { username: to },
        { email: to }
      ]
    }
  });
  if (!receiver) return res.status(404).json({ message: "Receiver not found" });
  if (receiver.id == req.user.id) return res.status(400).json({ message: "Cannot transfer to yourself" });
  if (Number(req.user.balance) < Number(amount)) return res.status(400).json({ message: "Not enough balance" });

  // Trừ tiền người gửi
  await req.user.update({ balance: Number(req.user.balance) - Number(amount) });
  // Cộng tiền người nhận
  await receiver.update({ balance: Number(receiver.balance) + Number(amount) });

  // Lưu transaction 2 bên
  await Transaction.create({
    user_id: req.user.id,
    type: 'transfer',
    amount,
    related_user_id: receiver.id,
    status: 'completed',
    description: `Chuyển tiền cho ${receiver.username}`
  });
  await Transaction.create({
    user_id: receiver.id,
    type: 'receive',
    amount,
    related_user_id: req.user.id,
    status: 'completed',
    description: `Nhận tiền từ ${req.user.username}`
  });

  // Notification
  await Notification.create({
    user_id: req.user.id,
    type: 'transfer',
    message: `Bạn đã chuyển ${amount} cho ${receiver.username}`
  });
  await Notification.create({
    user_id: receiver.id,
    type: 'receive',
    message: `Bạn vừa nhận được ${amount} từ ${req.user.username}`
  });

  res.json({ message: "Transfer successful", newBalance: req.user.balance });
};

exports.history = async (req, res) => {
  const { type, from, to } = req.query;
  let where = { user_id: req.user.id };
  if (type) where.type = type;
  if (from && to) where.created_at = { [Op.between]: [from, to] };
  const transactions = await Transaction.findAll({
    where,
    order: [['created_at', 'DESC']]
  });
  res.json(transactions);
};

exports.detail = async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findOne({
    where: { id, user_id: req.user.id }
  });
  if (!transaction) return res.status(404).json({ message: "Not found" });
  res.json(transaction);
};
