const { verifyToken } = require('../utils/jwt');
const { Admin } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = verifyToken(token);
    const admin = await Admin.findByPk(decoded.id);
    if (!admin) return res.status(403).json({ message: "No admin permission" });
    req.admin = admin;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
