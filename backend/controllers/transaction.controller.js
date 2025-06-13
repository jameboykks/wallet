import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";

export const TransactionController = {
  async deposit(req, res) {
    const { amount } = req.body;
    if (amount <= 0) return res.status(400).json({ message: "Số tiền không hợp lệ" });
    const user = await User.findById(req.user.id);
    const newBalance = Number(user.balance) + Number(amount);
    await User.updateBalance(req.user.id, newBalance);
    await Transaction.create({
      user_id: req.user.id,
      type: "deposit",
      amount,
      status: "completed",
      description: "Nạp tiền vào ví"
    });
    await Notification.create({
      user_id: req.user.id,
      type: "deposit",
      message: `Nạp thành công ${amount} vào ví.`
    });
    res.json({ message: "Nạp thành công", newBalance });
  },

  async transfer(req, res) {
    const { to_user_id, amount, description } = req.body;
    if (amount <= 0) return res.status(400).json({ message: "Số tiền không hợp lệ" });
    if (to_user_id === req.user.id) return res.status(400).json({ message: "Không thể chuyển cho chính mình" });
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(to_user_id);
    if (!receiver) return res.status(404).json({ message: "Người nhận không tồn tại" });
    if (sender.balance < amount) return res.status(400).json({ message: "Số dư không đủ" });
    await User.updateBalance(req.user.id, sender.balance - amount);
    await User.updateBalance(to_user_id, Number(receiver.balance) + Number(amount));
    await Transaction.create({
      user_id: req.user.id,
      to_user_id,
      type: "transfer",
      amount,
      status: "completed",
      description: description || `Chuyển tiền tới ${receiver.username}`
    });
    await Notification.create({
      user_id: req.user.id,
      type: "transfer",
      message: `Bạn đã chuyển ${amount} đến ${receiver.username}.`
    });
    await Notification.create({
      user_id: to_user_id,
      type: "receive",
      message: `Bạn vừa nhận ${amount} từ ${sender.username}.`
    });
    res.json({ message: "Chuyển tiền thành công" });
  },

  async history(req, res) {
    const transactions = await Transaction.findByUser(req.user.id);
    res.json(transactions);
  },

  async detail(req, res) {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    res.json(transaction);
  }
};
