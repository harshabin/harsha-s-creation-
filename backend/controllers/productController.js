const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Fetch all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      gender,
      size,
      minPrice,
      maxPrice,
      search,
      sort,
      isFeatured,
      isNewArrival,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Category filter (supports single or comma-separated)
    if (category && category !== 'All') {
      const categories = category.split(',').map(c => c.trim());
      query.category = { $in: categories };
    }

    // Gender filter
    if (gender && gender !== 'All') {
      query.$or = [{ gender: gender }, { gender: 'Unisex' }];
    }

    // Size filter
    if (size && size !== 'All') {
      const sizes = size.split(',').map(s => s.trim());
      query.sizes = { $in: sizes };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Keyword Search
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { category: regex }
      ];
    }

    // Featured / New Arrival flags
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }
    if (isNewArrival === 'true') {
      query.isNewArrival = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'name_asc') {
      sortOptions = { name: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      data: products,
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

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    let product;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id);
    } else {
      product = await Product.findOne({ slug: req.params.id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch reviews for this product
    const reviews = await Review.find({ product: product._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    // Fetch related products from same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.json({
      success: true,
      data: {
        product,
        reviews,
        relatedProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review for a product
// @route   POST /api/products/:id/reviews
// @access  Private (Customer)
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, title } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: req.params.id,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: req.params.id,
      rating: Number(rating),
      title: title || '',
      comment
    });

    // Update aggregate rating on product
    const allReviews = await Review.find({ product: req.params.id });
    const avgRating =
      allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    product.rating = Number(avgRating.toFixed(1));
    product.numReviews = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      gender,
      sizes,
      colors,
      price,
      discountPrice,
      stock,
      images,
      description,
      fabricDetails,
      isFeatured,
      isNewArrival
    } = req.body;

    if (!name || !category || !price || !description || !images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, category, price, description and at least one image'
      });
    }

    const product = await Product.create({
      name,
      category,
      gender: gender || 'Unisex',
      sizes: sizes && sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'],
      colors: colors && colors.length > 0 ? colors : [{ name: 'Default', hex: '#111827' }],
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: Number(stock) || 0,
      images: Array.isArray(images) ? images : [images],
      description,
      fabricDetails: fabricDetails || {
        composition: '100% Premium Combed Cotton',
        care: 'Machine wash cold, tumble dry low',
        fit: 'Relaxed Modern Fit'
      },
      isFeatured: isFeatured || false,
      isNewArrival: isNewArrival || false
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const fields = [
      'name',
      'category',
      'gender',
      'sizes',
      'colors',
      'price',
      'discountPrice',
      'stock',
      'images',
      'description',
      'fabricDetails',
      'isFeatured',
      'isNewArrival'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ product: req.params.id });

    res.json({
      success: true,
      message: 'Product removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct
};
