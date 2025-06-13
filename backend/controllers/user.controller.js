const { User, Contact, Transaction } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

exports.getProfile = async (req, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    phone: user.phone,
    avatar_url: user.avatar_url,
    balance: user.balance,
    is_locked: user.is_locked,
    two_fa_enabled: user.two_fa_enabled,
    created_at: user.created_at
  });
};

exports.updateProfile = async (req, res) => {
  const user = req.user;
  const { full_name, phone, avatar_url } = req.body;
  await user.update({ full_name, phone, avatar_url });
  res.json({ message: "Profile updated" });
};

exports.changePassword = async (req, res) => {
  const user = req.user;
  const { old_password, new_password } = req.body;
  if (!await bcrypt.compare(old_password, user.password_hash))
    return res.status(400).json({ message: "Old password not match" });
  const hash = await bcrypt.hash(new_password, 10);
  await user.update({ password_hash: hash });
  res.json({ message: "Password changed" });
};

exports.lockAccount = async (req, res) => {
  const user = req.user;
  await user.update({ is_locked: true });
  res.json({ message: "Account locked" });
};

exports.unlockAccount = async (req, res) => {
  const user = req.user;
  await user.update({ is_locked: false });
  res.json({ message: "Account unlocked" });
};

exports.toggle2FA = async (req, res) => {
  const user = req.user;
  const enable = req.body.enable === true;
  await user.update({ two_fa_enabled: enable });
  res.json({ message: enable ? "2FA enabled" : "2FA disabled" });
};

exports.getContacts = async (req, res) => {
  const contacts = await Contact.findAll({
    where: { user_id: req.user.id },
    include: [{ association: 'contactUser', attributes: ['id', 'username', 'full_name', 'avatar_url'] }]
  });
  res.json(contacts);
};

exports.addContact = async (req, res) => {
  const { contact_user_id, nickname } = req.body;
  if (contact_user_id == req.user.id) return res.status(400).json({ message: "Cannot add yourself" });
  const exist = await Contact.findOne({ where: { user_id: req.user.id, contact_user_id } });
  if (exist) return res.status(400).json({ message: "Already in contacts" });
  await Contact.create({ user_id: req.user.id, contact_user_id, nickname });
  res.json({ message: "Contact added" });
};

exports.deleteContact = async (req, res) => {
  const { contact_user_id } = req.body;
  await Contact.destroy({ where: { user_id: req.user.id, contact_user_id } });
  res.json({ message: "Contact deleted" });
};
