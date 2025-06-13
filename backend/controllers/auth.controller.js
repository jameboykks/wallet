const { User, OtpCode } = require('../models');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { username, email, password, full_name, phone } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "Missing field" });
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      username, email, password_hash: hash, full_name, phone
    });
    res.status(201).json({ message: "Registered successfully" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { username: usernameOrEmail },
          { email: usernameOrEmail }
        ]
      }
    });
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ message: "Invalid credentials" });
    if (user.is_locked)
      return res.status(403).json({ message: "Account is locked" });

    // Nếu bật 2FA, trả về yêu cầu 2FA
    if (user.two_fa_enabled) {
      // Tạo OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 3 * 60 * 1000); // 3 phút
      await OtpCode.create({ user_id: user.id, code, expires_at: expires });
      // Gửi OTP, ở đây trả về response luôn (dev), prod thì gửi email
      return res.status(202).json({ message: "Require 2FA", userId: user.id, code });
    }

    // Không bật 2FA
    const token = signToken({ id: user.id, role: "user" });
    res.json({ token });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.verify2FA = async (req, res) => {
  try {
    const { userId, code } = req.body;
    const otp = await OtpCode.findOne({
      where: { user_id: userId, code },
      order: [['created_at', 'DESC']]
    });
    if (!otp || new Date() > otp.expires_at)
      return res.status(400).json({ message: "OTP invalid or expired" });
    await OtpCode.destroy({ where: { id: otp.id } });
    const token = signToken({ id: userId, role: "user" });
    res.json({ token });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
