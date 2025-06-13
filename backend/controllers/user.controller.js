import { User } from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js";
import { Notification } from "../models/notification.model.js";
import { Contact } from "../models/contact.model.js";
import bcrypt from "bcrypt";

export const UserController = {
  async getProfile(req, res) {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  },
  async updateProfile(req, res) {
    const { username, phone, avatar } = req.body;
    await User.updateProfile(req.user.id, { username, phone, avatar });
    res.json({ message: "Cập nhật thành công" });
  },
  async changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) return res.status(400).json({ message: "Sai mật khẩu cũ" });
    const password_hash = await bcrypt.hash(newPassword, 10);
    await User.changePassword(req.user.id, password_hash);
    res.json({ message: "Đổi mật khẩu thành công" });
  },
  async getBalance(req, res) {
    const user = await User.findById(req.user.id);
    res.json({ balance: user.balance });
  },
  async getContacts(req, res) {
    const contacts = await Contact.findByUser(req.user.id);
    res.json(contacts);
  },
  async addContact(req, res) {
    const { contact_user_id, nickname } = req.body;
    if (contact_user_id === req.user.id) return res.status(400).json({ message: "Không thể thêm chính bạn" });
    await Contact.create({ user_id: req.user.id, contact_user_id, nickname });
    res.json({ message: "Đã thêm vào danh bạ" });
  },
  async removeContact(req, res) {
    const { contact_user_id } = req.body;
    await Contact.delete(req.user.id, contact_user_id);
    res.json({ message: "Đã xoá khỏi danh bạ" });
  }
};
