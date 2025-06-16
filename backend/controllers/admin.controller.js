import { pool } from "../models/db.js";

export const AdminController = {
  // Lấy danh sách tất cả user
  getAllUsers: async (req, res) => {
    try {
      const [users] = await pool.query("SELECT id, username, email, phone, avatar, balance, is_admin, is_locked, created_at FROM users ORDER BY created_at DESC");
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách user" });
    }
  },
  // Khoá user
  lockUser: async (req, res) => {
    try {
      const userId = req.params.id;
      await pool.query("UPDATE users SET is_locked=1 WHERE id=?", [userId]);
      res.json({ message: "Đã khoá tài khoản" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi khoá user" });
    }
  },
  // Mở khoá user
  unlockUser: async (req, res) => {
    try {
      const userId = req.params.id;
      await pool.query("UPDATE users SET is_locked=0 WHERE id=?", [userId]);
      res.json({ message: "Đã mở khoá tài khoản" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi mở khoá user" });
    }
  },
  // Lấy danh sách tất cả giao dịch
  getAllTransactions: async (req, res) => {
    try {
      const [transactions] = await pool.query(`
        SELECT t.*, u1.username as sender_name, u2.username as receiver_name
        FROM transactions t
        LEFT JOIN users u1 ON t.user_id = u1.id
        LEFT JOIN users u2 ON t.to_user_id = u2.id
        ORDER BY t.created_at DESC
      `);
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách giao dịch" });
    }
  },
  // Lấy danh sách notification toàn hệ thống
  getAllNotifications: async (req, res) => {
    try {
      const [notifications] = await pool.query(`
        SELECT n.*, u.username FROM notifications n
        LEFT JOIN users u ON n.user_id = u.id
        ORDER BY n.created_at DESC
      `);
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi lấy notification" });
    }
  },
  // Thống kê tổng tiền, giao dịch nổi bật
  getStats: async (req, res) => {
    try {
      const [[{ total_balance }]] = await pool.query("SELECT SUM(balance) as total_balance FROM users");
      const [[{ total_transactions }]] = await pool.query("SELECT COUNT(*) as total_transactions FROM transactions");
      const [topTransactions] = await pool.query(`
        SELECT t.*, u1.username as sender_name, u2.username as receiver_name
        FROM transactions t
        LEFT JOIN users u1 ON t.user_id = u1.id
        LEFT JOIN users u2 ON t.to_user_id = u2.id
        ORDER BY t.amount DESC
        LIMIT 5
      `);
      res.json({ total_balance, total_transactions, topTransactions });
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi lấy thống kê" });
    }
  },
};
