const PaymentController = require('../controllers/PaymentController');
const Authentication = require('../middleware/Authentication');

const router = require('express').Router();

router.use(Authentication);

router.post('/', PaymentController.paymentData);

module.exports = router;
