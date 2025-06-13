import { pool } from "./db.js";

export const Transaction = {
  async create(data) {
    const { user_id, to_user_id, type, amount, status, description } = data;
    const [res] = await pool.query(
      "INSERT INTO transactions (user_id, to_user_id, type, amount, status, description) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, to_user_id, type, amount, status, description]
    );
    return res.insertId;
  },
  async findByUser(user_id) {
    const [rows] = await pool.query(
      "SELECT * FROM transactions WHERE user_id=? OR to_user_id=? ORDER BY created_at DESC",
      [user_id, user_id]
    );
    return rows;
  },
  async findAll() {
    const [rows] = await pool.query("SELECT * FROM transactions ORDER BY created_at DESC");
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM transactions WHERE id=?", [id]);
    return rows[0];
  }
};
export default Transaction;