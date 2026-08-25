const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

// Initialize Razorpay client if valid keys provided
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret && !keyId.includes('demo') && !keySecret.includes('demo')) {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }
  return null;
};

// @desc    Initiate Razorpay / Gateway payment order
// @route   POST /api/payment/initiate
// @access  Private
const initiatePayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized for this order' });
    }

    const razorpay = getRazorpayInstance();
    const amountInPaise = Math.round(order.totalAmount * 100);

    if (razorpay) {
      // Real Razorpay API Order Creation
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${order._id.toString().slice(-8)}`,
        notes: {
          orderId: order._id.toString(),
          userId: req.user._id.toString()
        }
      };

      const razorpayOrder = await razorpay.orders.create(options);

      return res.json({
        success: true,
        data: {
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
          orderId: order._id,
          isSimulator: false
        }
      });
    } else {
      // Robust Test Mode / Simulator Payload
      const mockRazorpayOrderId = `order_demo_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      return res.json({
        success: true,
        data: {
          razorpayOrderId: mockRazorpayOrderId,
          amount: amountInPaise,
          currency: 'INR',
          keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_ownbrand_demo',
          orderId: order._id,
          isSimulator: true
        }
      });
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    next(error);
  }
};

// @desc    Verify Razorpay signature & mark order paid
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isSimulator
    } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let isValid = false;

    if (isSimulator || !keySecret || keySecret.includes('demo')) {
      // Simulator verification
      isValid = true;
    } else {
      // Cryptographic HMAC SHA256 Signature Verification
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isValid = generatedSignature === razorpay_signature;
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid transaction signature'
      });
    }

    // Update order status
    order.paymentStatus = 'Paid';
    order.status = 'Processing';
    order.paidAt = new Date();
    order.paymentResult = {
      id: razorpay_payment_id || `pay_sim_${Date.now()}`,
      status: 'captured',
      razorpay_order_id: razorpay_order_id || 'order_sim',
      razorpay_payment_id: razorpay_payment_id || `pay_sim_${Date.now()}`,
      razorpay_signature: razorpay_signature || 'simulated_sig',
      update_time: new Date().toISOString(),
      email_address: req.user.email
    };

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Payment verified and order marked as Paid',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Handle Razorpay Webhook Events
// @route   POST /api/payment/webhook
// @access  Public
const handleWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret) {
      const signature = req.headers['x-razorpay-signature'];
      const body = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    console.log(`📡 Razorpay Webhook Event received: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body.payload.payment.entity;
      const orderId = paymentEntity.notes ? paymentEntity.notes.orderId : null;

      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && order.paymentStatus !== 'Paid') {
          order.paymentStatus = 'Paid';
          order.status = 'Processing';
          order.paidAt = new Date();
          order.paymentResult = {
            id: paymentEntity.id,
            status: paymentEntity.status,
            update_time: new Date().toISOString()
          };
          await order.save();
        }
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
  handleWebhook
};
