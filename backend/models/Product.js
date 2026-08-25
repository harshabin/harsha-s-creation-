const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      enum: ['Hoodies', 'T-Shirts', 'Jackets', 'Shirts', 'Pants', 'Dresses', 'Accessories']
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex'],
      default: 'Unisex'
    },
    sizes: {
      type: [String],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
      required: true,
      default: ['S', 'M', 'L', 'XL']
    },
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true }
      }
    ],
    price: {
      type: Number,
      required: [true, 'Please specify product price'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    discountPrice: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      required: [true, 'Please specify stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 20
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one product image'],
      validate: [arr => arr.length > 0, 'At least one image is required']
    },
    description: {
      type: String,
      required: [true, 'Please provide product description']
    },
    fabricDetails: {
      composition: { type: String, default: '100% Premium Combed Cotton' },
      care: { type: String, default: 'Machine wash cold, gentle cycle, tumble dry low' },
      fit: { type: String, default: 'Relaxed / Modern Fit' }
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate slug if not provided
productSchema.pre('save', function (next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
