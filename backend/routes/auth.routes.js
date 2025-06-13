const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/2fa', AuthController.verify2FA);

module.exports = router;
