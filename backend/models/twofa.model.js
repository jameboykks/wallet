import { pool } from "./db.js";

export const TwoFA = {
  async create(user_id, otp, expires_at) {
    await pool.query(
      "INSERT INTO twofa_tokens (user_id, otp, expires_at) VALUES (?, ?, ?)",
      [user_id, otp, expires_at]
    );
  },
  async verify(user_id, otp) {
    const [rows] = await pool.query(
      "SELECT * FROM twofa_tokens WHERE user_id=? AND otp=? AND expires_at > NOW() ORDER BY id DESC LIMIT 1",
      [user_id, otp]
    );
    return rows[0];
  },
  async deleteOld(user_id) {
    await pool.query("DELETE FROM twofa_tokens WHERE user_id=?", [user_id]);
  }
};
