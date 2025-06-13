const router = require('express').Router();
const auth = require('../middlewares/auth');
const UserController = require('../controllers/user.controller');

router.get('/profile', auth, UserController.getProfile);
router.put('/profile', auth, UserController.updateProfile);
router.put('/change-password', auth, UserController.changePassword);
router.post('/lock', auth, UserController.lockAccount);
router.post('/unlock', auth, UserController.unlockAccount);
router.post('/toggle-2fa', auth, UserController.toggle2FA);

router.get('/contacts', auth, UserController.getContacts);
router.post('/contacts', auth, UserController.addContact);
router.delete('/contacts', auth, UserController.deleteContact);

module.exports = router;
