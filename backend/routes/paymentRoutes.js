const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  verifyPayment,
  handleWebhook
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/initiate', protect, initiatePayment);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', handleWebhook);

module.exports = router;
