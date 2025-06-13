import { User } from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js";
import { Notification } from "../models/notification.model.js";

export const AdminController = {
  async listUsers(req, res) {
    const users = await User.findAll();
    res.json(users);
  },
  async lockUser(req, res) {
    const { user_id } = req.body;
    await User.setLock(user_id, 1);
    res.json({ message: "Đã khoá tài khoản" });
  },
  async unlockUser(req, res) {
    const { user_id } = req.body;
    await User.setLock(user_id, 0);
    res.json({ message: "Đã mở khoá tài khoản" });
  },
  async listTransactions(req, res) {
    const trans = await Transaction.findAll();
    res.json(trans);
  },
  async dashboard(req, res) {
    // Tổng tiền hệ thống, top giao dịch
    const users = await User.findAll();
    const transactions = await Transaction.findAll();
    const total = users.reduce((s, u) => s + Number(u.balance || 0), 0);
    const top = transactions.slice(0, 5);
    res.json({ total_balance: total, top_transactions: top });
  },
  async notifications(req, res) {
    const noti = await Notification.findAll();
    res.json(noti);
  }
};
