import { User, Transaction, Notification, TwoFAToken } from "../models/index.js";
// import { Op } from "sequelize";
import nodemailer from "nodemailer";
import { pool } from "../models/db.js";

// Gửi OTP qua email (cần App Password, hướng dẫn bên dưới)
async function sendOTPEmail(toEmail, otpCode) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER, // Email gửi
      pass: process.env.MAIL_PASS, // App password, không phải mật khẩu Gmail bình thường
    },
  });
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: toEmail,
    subject: "Mã xác thực chuyển tiền E-Wallet",
    text: `Mã OTP chuyển tiền của bạn là: ${otpCode}`,
    html: `<div>
      <p><b>Mã OTP chuyển tiền của bạn là:</b></p>
      <h2>${otpCode}</h2>
      <p>Hiệu lực trong 5 phút.</p>
    </div>`,
  });
}

export const TransactionController = {
  // Nạp tiền vào ví
  deposit: async (req, res) => {
    try {
      const { amount } = req.body;
      if (amount <= 0) return res.status(400).json({ message: "Số tiền không hợp lệ!" });
      await pool.query("UPDATE users SET balance = balance + ? WHERE id = ?", [Number(amount), req.user.id]);

      await Transaction.create({
        user_id: req.user.id,
        type: 'deposit',
        amount,
        status: 'completed',
        description: 'Nạp tiền vào ví'
      });
      await Notification.create({
        user_id: req.user.id,
        type: 'deposit',
        message: `Nạp thành công ${amount} vào ví.`
      });
      res.json({ message: "Nạp tiền thành công", newBalance: req.user.balance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi nạp tiền!" });
    }
  },

  // Chuyển tiền với 2FA OTP
  transfer: async (req, res) => {
    try {
      const { to_user_id, amount, otp } = req.body;
      const fromUser = req.user;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Số tiền không hợp lệ!" });
      }

      const [userRows] = await pool.query("SELECT * FROM users WHERE id=?", [to_user_id]);
      const toUser = userRows[0];
      if (!toUser) {
        return res.status(404).json({ message: "Tài khoản nhận không tồn tại!" });
      }
      if (toUser.id === fromUser.id) {
        return res.status(400).json({ message: "Không thể chuyển cho chính mình!" });
      }
      if (fromUser.balance < amount) {
        return res.status(400).json({ message: "Số dư không đủ!" });
      }

      // Yêu cầu OTP nếu chưa xác thực
      if (!otp) {
        const otpCode = "123456"; // Hardcode OTP
        await TwoFAToken.create({
          user_id: fromUser.id,
          otp: otpCode,
          expires_at: new Date(Date.now() + 5 * 60 * 1000),
          type: 'transfer',
        });
        await sendOTPEmail(fromUser.email, otpCode);
        return res.status(401).json({ message: "Vui lòng nhập mã OTP đã gửi về email của bạn để xác nhận chuyển tiền." });
      }

      // Kiểm tra OTP hợp lệ
      const [rows] = await pool.query(
        "SELECT * FROM twofa_tokens WHERE user_id=? AND otp=? AND type='transfer' AND expires_at > NOW() LIMIT 1",
        [fromUser.id, otp]
      );
      if (!rows.length) {
        return res.status(400).json({ message: "OTP không đúng hoặc đã hết hạn!" });
      }
      const otpRecord = rows[0];
      // Xóa OTP đã dùng
      await pool.query("DELETE FROM twofa_tokens WHERE id=?", [otpRecord.id]);

      // Tiến hành chuyển tiền
      await pool.query("UPDATE users SET balance = balance - ? WHERE id = ?", [amount, fromUser.id]);
      await pool.query("UPDATE users SET balance = balance + ? WHERE id = ?", [amount, toUser.id]);

      // Lưu transaction
      await Transaction.create({
        user_id: fromUser.id,
        to_user_id: toUser.id,
        type: 'transfer',
        amount,
        status: 'completed',
        description: `Chuyển tiền đến user #${toUser.id} (${toUser.username})`
      });
      await Transaction.create({
        user_id: toUser.id,
        to_user_id: fromUser.id,
        type: 'receive',
        amount,
        status: 'completed',
        description: `Nhận tiền từ user #${fromUser.id} (${fromUser.username})`
      });

      await Notification.create({
        user_id: fromUser.id,
        type: "transfer",
        message: `Bạn vừa chuyển ${amount} đến ${toUser.username}.`
      });
      await Notification.create({
        user_id: toUser.id,
        type: "receive",
        message: `Bạn vừa nhận ${amount} từ ${fromUser.username}.`
      });

      res.json({ message: "Chuyển tiền thành công!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi chuyển tiền!" });
    }
  },

  // Xem lịch sử giao dịch
  history: async (req, res) => {
    try {
      const list = await Transaction.findAll({
        where: { user_id: req.user.id },
        order: [["createdAt", "DESC"]],
        limit: 50,
      });
      res.json(list);
    } catch (err) {
      res.status(500).json({ message: "Lỗi khi lấy lịch sử giao dịch!" });
    }
  },

  search: async (req, res) => {
    try {
      const userId = req.user.id;
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        type: req.query.type,
        searchTerm: req.query.searchTerm
      };

      if (typeof Transaction.search === 'function') {
        const transactions = await Transaction.search(userId, filters);
        res.json(transactions);
      } else {
        // Nếu Transaction.search chưa có, trả về tất cả giao dịch của user
        const transactions = await Transaction.findAll({ where: { user_id: userId } });
        res.json(transactions);
      }
    } catch (error) {
      console.error("Error searching transactions:", error);
      res.status(500).json({ message: "Error searching transactions" });
    }
  },

  // ... bạn có thể bổ sung các hàm khác ở đây nếu cần
};


