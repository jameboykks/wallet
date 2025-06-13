import { pool } from "./db.js";

export const Contact = {
  async findByUser(user_id) {
    const [rows] = await pool.query(
      "SELECT c.*, u.username, u.email FROM contacts c JOIN users u ON c.contact_user_id = u.id WHERE c.user_id=?",
      [user_id]
    );
    return rows;
  },
  async create(data) {
    const { user_id, contact_user_id, nickname } = data;
    await pool.query(
      "INSERT INTO contacts (user_id, contact_user_id, nickname) VALUES (?, ?, ?)",
      [user_id, contact_user_id, nickname]
    );
  },
  async delete(user_id, contact_user_id) {
    await pool.query(
      "DELETE FROM contacts WHERE user_id=? AND contact_user_id=?",
      [user_id, contact_user_id]
    );
  }
};
