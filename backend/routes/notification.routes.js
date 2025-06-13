const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotificationController = require('../controllers/notification.controller');

router.get('/list', auth, NotificationController.list);
router.post('/read', auth, NotificationController.read);

module.exports = router;
