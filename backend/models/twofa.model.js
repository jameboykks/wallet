import { pool } from "./db.js";

export const TwoFA = {
  async create(obj) {
    // Thêm 1 bản ghi OTP mới vào bảng twofa_tokens
    return pool.query("INSERT INTO twofa_tokens SET ?", obj);
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
export default TwoFA;