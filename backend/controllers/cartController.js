const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug images price discountPrice stock category sizes colors isFeatured'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out items where product may have been deleted
    const validItems = cart.items.filter(item => item.product != null);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce((acc, item) => {
      const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
      return acc + price * item.quantity;
    }, 0);

    res.json({
      success: true,
      data: {
        _id: cart._id,
        items: cart.items,
        totalItems: cart.items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, size = 'M', color = '', quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} units available in stock`
      });
    }

    const price = product.discountPrice > 0 ? product.discountPrice : product.price;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if identical item (productId + size + color) already in cart
    const existingIndex = cart.items.findIndex(
      item =>
        item.product.toString() === productId &&
        item.size === size &&
        (item.color || '') === (color || '')
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Max stock available: ${product.stock}`
        });
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = price;
    } else {
      cart.items.push({
        product: productId,
        size,
        color,
        quantity: Number(quantity),
        price
      });
    }

    await cart.save();

    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug images price discountPrice stock category'
    });

    const subtotal = populatedCart.items.reduce((acc, item) => {
      const itemPrice = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
      return acc + itemPrice * item.quantity;
    }, 0);

    res.json({
      success: true,
      message: 'Item added to cart',
      data: {
        _id: populatedCart._id,
        items: populatedCart.items,
        totalItems: populatedCart.items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const product = await Product.findById(item.product);
    if (product && quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} units available in stock`
      });
    }

    item.quantity = Number(quantity);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug images price discountPrice stock category'
    });

    const subtotal = populatedCart.items.reduce((acc, itm) => {
      const price = itm.product.discountPrice > 0 ? itm.product.discountPrice : itm.product.price;
      return acc + price * itm.quantity;
    }, 0);

    res.json({
      success: true,
      message: 'Cart updated',
      data: {
        _id: populatedCart._id,
        items: populatedCart.items,
        totalItems: populatedCart.items.reduce((acc, itm) => acc + itm.quantity, 0),
        subtotal
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug images price discountPrice stock category'
    });

    const subtotal = populatedCart.items.reduce((acc, itm) => {
      const price = itm.product.discountPrice > 0 ? itm.product.discountPrice : itm.product.price;
      return acc + price * itm.quantity;
    }, 0);

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        _id: populatedCart._id,
        items: populatedCart.items,
        totalItems: populatedCart.items.reduce((acc, itm) => acc + itm.quantity, 0),
        subtotal
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared',
      data: { items: [], totalItems: 0, subtotal: 0 }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
