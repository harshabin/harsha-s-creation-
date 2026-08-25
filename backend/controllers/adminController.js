const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get Admin Dashboard stats & analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();

    // Calculate total revenue from Paid orders
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Order counts by status
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const orderStatusMap = {
      Placed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };
    statusCounts.forEach(s => {
      if (orderStatusMap[s._id] !== undefined) {
        orderStatusMap[s._id] = s.count;
      }
    });

    // Low stock products (stock <= 5)
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select('name category stock price images')
      .limit(6);

    // Recent 6 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('user', 'name email');

    // Sales by Category
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        orderStatusMap,
        lowStockProducts,
        recentOrders,
        categoryStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered customers
// @route   GET /api/admin/customers
// @access  Private/Admin
const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Attach order summary per customer
    const customersWithOrders = await Promise.all(
      customers.map(async customer => {
        const orderCount = await Order.countDocuments({ user: customer._id });
        const spentData = await Order.aggregate([
          { $match: { user: customer._id, paymentStatus: 'Paid' } },
          { $group: { _id: null, totalSpent: { $sum: '$totalAmount' } } }
        ]);
        const totalSpent = spentData.length > 0 ? spentData[0].totalSpent : 0;

        return {
          ...customer.toObject(),
          orderCount,
          totalSpent
        };
      })
    );

    res.json({
      success: true,
      data: customersWithOrders
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getCustomers
};
