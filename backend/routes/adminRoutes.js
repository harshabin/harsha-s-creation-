const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const {
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const {
  getAdminStats,
  getCustomers
} = require('../controllers/adminController');

// All admin routes require authentication & admin role
router.use(protect, admin);

// Product management
router.route('/products')
  .post(createProduct);

router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

// Order management
router.route('/orders')
  .get(getAllOrders);

router.route('/orders/:id')
  .put(updateOrderStatus);

// Stats & Customers
router.get('/stats', getAdminStats);
router.get('/customers', getCustomers);

module.exports = router;
