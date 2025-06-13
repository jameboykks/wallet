import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const AuthController = {
  async register(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "Thiếu thông tin" });
    const exist = await User.findByEmail(email);
    if (exist) return res.status(400).json({ message: "Email đã tồn tại" });
    const password_hash = await bcrypt.hash(password, 10);
    const id = await User.create({ username, email, password_hash });
    return res.json({ message: "Đăng ký thành công", user_id: id });
  },

  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ message: "Email không tồn tại" });
    if (user.is_locked) return res.status(403).json({ message: "Tài khoản bị khoá" });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Sai mật khẩu" });
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );
    res.json({ token });
  }
};
