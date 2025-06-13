import { pool } from "./db.js";


export const User = {
  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },
  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },
  async findAll() {
    const [rows] = await pool.query("SELECT * FROM users WHERE is_admin=0");
    return rows;
  },
  async create(data) {
    const { username, email, password_hash } = data;
    const [res] = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, password_hash]
    );
    return res.insertId;
  },
  async updateProfile(id, data) {
    const { username, phone, avatar } = data;
    await pool.query(
      "UPDATE users SET username=?, phone=?, avatar=? WHERE id=?",
      [username, phone, avatar, id]
    );
  },
  async updateBalance(id, newBalance) {
    await pool.query("UPDATE users SET balance=? WHERE id=?", [newBalance, id]);
  },
  async setLock(id, is_locked) {
    await pool.query("UPDATE users SET is_locked=? WHERE id=?", [is_locked, id]);
  },
  async changePassword(id, password_hash) {
    await pool.query("UPDATE users SET password_hash=? WHERE id=?", [password_hash, id]);
  }
};
export default User;