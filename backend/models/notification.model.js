import { pool } from "./db.js";

export const Notification = {
  async create(data) {
    const { user_id, type, message } = data;
    await pool.query(
      "INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)",
      [user_id, type, message]
    );
  },
  async findByUser(user_id) {
    const [rows] = await pool.query(
      "SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC",
      [user_id]
    );
    return rows;
  },
  async findAll() {
    const [rows] = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC");
    return rows;
  }
};
