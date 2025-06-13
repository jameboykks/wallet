const router = require('express').Router();
const auth = require('../middlewares/auth');
const TransactionController = require('../controllers/transaction.controller');

router.post('/deposit', auth, TransactionController.deposit);
router.post('/transfer', auth, TransactionController.transfer);
router.get('/history', auth, TransactionController.history);
router.get('/detail/:id', auth, TransactionController.detail);

module.exports = router;
