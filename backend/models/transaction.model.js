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
  },
  async search(user_id, filters) {
    let query = `
      SELECT t.*, 
        u1.username as sender_name,
        u2.username as receiver_name
      FROM transactions t
      LEFT JOIN users u1 ON t.user_id = u1.id
      LEFT JOIN users u2 ON t.to_user_id = u2.id
      WHERE (t.user_id = ? OR t.to_user_id = ?)
    `;
    const params = [user_id, user_id];
    if (filters.startDate) {
      query += " AND DATE(t.created_at) >= ?";
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += " AND DATE(t.created_at) <= ?";
      params.push(filters.endDate);
    }
    if (filters.type) {
      query += " AND t.type = ?";
      params.push(filters.type);
    }
    if (filters.searchTerm) {
      query += " AND (u1.username LIKE ? OR u2.username LIKE ? OR t.description LIKE ?)";
      const searchPattern = `%${filters.searchTerm}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    query += " ORDER BY t.created_at DESC";
    const [rows] = await pool.query(query, params);
    return rows;
  }
};

export default Transaction;