const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.is_locked) return res.status(403).json({ message: "Account is locked" });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
