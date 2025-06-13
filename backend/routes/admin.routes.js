const router = require('express').Router();
const admin = require('../middlewares/admin');
const AdminController = require('../controllers/admin.controller');

router.get('/users', admin, AdminController.getUsers);
router.post('/lock-user', admin, AdminController.lockUser);
router.post('/unlock-user', admin, AdminController.unlockUser);
router.get('/transactions', admin, AdminController.getTransactions);
router.get('/statistics', admin, AdminController.statistics);
router.get('/notifications', admin, AdminController.getNotifications);

module.exports = router;
