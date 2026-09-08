const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount,
      totalAmount,
      notes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ success: false, message: 'Please provide full shipping address' });
    }

    // Verify products exist, validate stock and positive integer quantities
    const validatedItems = [];
    const productsToUpdate = [];

    for (const item of items) {
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for garment ${item.name || 'item'}. Must be between 1 and 20.`
        });
      }

      const product = await Product.findById(item.product || item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name || item.productId} not found`
        });
      }

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} units available.`
        });
      }

      const itemPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

      validatedItems.push({
        product: product._id,
        name: product.name,
        image: (product.images && product.images[0]) || item.image || '/assets/products/hoodie_black.jpg',
        size: item.size || 'M',
        color: item.color || '',
        quantity: qty,
        price: itemPrice
      });

      productsToUpdate.push({ product, qty });
    }

    // Safely deduct stock after full validation
    for (const { product, qty } of productsToUpdate) {
      product.stock -= qty;
      await product.save();
    }

    // Server-enforced canonical pricing (Prevents client-side price tampering)
    const calculatedItemsPrice = validatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const calculatedDiscount = discountAmount !== undefined ? Math.max(0, Number(discountAmount)) : 0;
    // Free shipping above ₹1999, otherwise ₹150 flat shipping (aligned with store policy)
    const calculatedShipping = calculatedItemsPrice >= 1999 || calculatedItemsPrice === 0 ? 0 : 150;
    // 5% GST calculated on net subtotal after discount
    const calculatedTax = Math.round(Math.max(0, calculatedItemsPrice - calculatedDiscount) * 0.05);
    const finalTotal = Math.max(0, calculatedItemsPrice - calculatedDiscount + calculatedShipping + calculatedTax);

    const order = new Order({
      user: req.user._id,
      items: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Razorpay',
      itemsPrice: calculatedItemsPrice,
      taxPrice: calculatedTax,
      shippingPrice: calculatedShipping,
      discountAmount: calculatedDiscount,
      totalAmount: finalTotal,
      status: 'Placed',
      paymentStatus: 'Pending',
      notes: notes || ''
    });


    const createdOrder = await order.save();

    // Clear user's DB cart after order placed
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: createdOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name slug images category');

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug images category');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization: user must own order or be admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (paymentStatus && paymentStatus !== 'All') {
      query.paymentStatus = paymentStatus;
    }

    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * pageSize;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / pageSize),
        limit: pageSize
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, carrier, paymentStatus, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status) {
      order.status = status;
      if (status === 'Delivered') {
        order.deliveredAt = new Date();
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === 'Paid' && !order.paidAt) {
        order.paidAt = new Date();
      }
    }

    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }

    if (carrier !== undefined) {
      order.carrier = carrier;
    }

    if (notes !== undefined) {
      order.notes = notes;
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
