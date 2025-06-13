const jwt = require('jsonwebtoken');
const config = require('../config');

exports.signToken = (payload, expiresIn = '2d') =>
  jwt.sign(payload, config.jwtSecret, { expiresIn });

exports.verifyToken = (token) =>
  jwt.verify(token.replace('Bearer ', ''), config.jwtSecret);
