const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Review = require('../models/Review');

dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleProducts = [
  {
    name: 'Atelier Heavyweight Oversized Hoodie',
    category: 'Hoodies',
    gender: 'Unisex',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Onyx Black', hex: '#18181b' },
      { name: 'Glacier White', hex: '#f4f4f5' },
      { name: 'Mineral Sage', hex: '#4d5d53' }
    ],
    price: 3499,
    discountPrice: 2899,
    stock: 45,
    images: [
      '/assets/products/hoodie_black.jpg',
      '/assets/reson/hero_obsidian.jpg'
    ],
    description: 'Constructed from 480 GSM French Terry loopback cotton. Features dropped shoulders, seamless double-layer hood, deep kangaroo pocket, and ribbed trims. Designed for an effortless drape.',
    fabricDetails: {
      composition: '100% Organic French Terry Cotton (480 GSM)',
      care: 'Machine wash cold inside out, hang dry',
      fit: 'Relaxed Oversized Fit'
    },
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    numReviews: 38
  },
  {
    name: 'Sculpted Minimalist Trench Coat',
    category: 'Jackets',
    gender: 'Women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Midnight Charcoal', hex: '#27272a' },
      { name: 'Obsidian Black', hex: '#0a0a0a' }
    ],
    price: 6999,
    discountPrice: 5999,
    stock: 18,
    images: [
      '/assets/products/trench_coat.jpg',
      '/assets/reson/hero_glacier.jpg'
    ],
    description: 'A contemporary take on the timeless double-breasted trench coat. Crafted from weather-resistant twill with custom horn buttons, storm flaps, and a detachable cinch belt.',
    fabricDetails: {
      composition: '65% Cotton, 35% Recycled Polyester Twill',
      care: 'Dry clean only',
      fit: 'Tailored Longline Fit'
    },
    isFeatured: true,
    isNewArrival: false,
    rating: 4.8,
    numReviews: 24
  },
  {
    name: 'Raw Selvedge Denim Trucker Jacket',
    category: 'Jackets',
    gender: 'Men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Indigo Vintage', hex: '#1e3a8a' },
      { name: 'Washed Black', hex: '#262626' }
    ],
    price: 4999,
    discountPrice: 4299,
    stock: 22,
    images: [
      '/assets/products/selvedge_jacket.jpg',
      '/assets/reson/pedestal_feature.jpg'
    ],
    description: '14.5 oz Japanese selvedge denim woven on vintage shuttle looms. Features antique brass hardware, dual chest pockets, and contrast tobacco stitching that patinas uniquely over time.',
    fabricDetails: {
      composition: '100% Selvedge Indigo Denim',
      care: 'Cold soak, dry in shade',
      fit: 'Classic Boxy Fit'
    },
    isFeatured: true,
    isNewArrival: true,
    rating: 5.0,
    numReviews: 19
  },
  {
    name: 'Signature Boxy Heavyweight Tee',
    category: 'T-Shirts',
    gender: 'Unisex',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Chalk White', hex: '#f4f4f5' },
      { name: 'Pitch Black', hex: '#09090b' },
      { name: 'Mineral Sage', hex: '#84a98c' }
    ],
    price: 1499,
    discountPrice: 1199,
    stock: 80,
    images: [
      '/assets/products/heavy_tee.jpg',
      '/assets/reson/hero_glacier.jpg'
    ],
    description: 'The foundation of any modern capsule wardrobe. 280 GSM combed cotton featuring a thick 1.25" bound collar that will never bacon or stretch. Pre-shrunk for an enduring silhouette.',
    fabricDetails: {
      composition: '100% Combed Ringspun Cotton (280 GSM)',
      care: 'Machine wash warm, tumble dry gentle',
      fit: 'Boxy Drop-Shoulder Fit'
    },
    isFeatured: true,
    isNewArrival: false,
    rating: 4.7,
    numReviews: 64
  },
  {
    name: 'Relaxed Pleated Wide-Leg Trousers',
    category: 'Pants',
    gender: 'Men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal Grey', hex: '#3f3f46' },
      { name: 'Onyx Black', hex: '#18181b' }
    ],
    price: 3899,
    discountPrice: 3299,
    stock: 25,
    images: [
      '/assets/products/wide_pants.jpg',
      '/assets/reson/hero_sage.jpg'
    ],
    description: 'Double front pleats give these wide trousers dynamic volume and fluid movement. Styled with an elasticated back waistband for comfort and clean hook-and-bar front closure.',
    fabricDetails: {
      composition: '70% Polyester, 28% Rayon, 2% Spandex',
      care: 'Dry clean recommended or gentle cold cycle',
      fit: 'Relaxed Wide Leg with High Rise'
    },
    isFeatured: false,
    isNewArrival: true,
    rating: 4.8,
    numReviews: 15
  },
  {
    name: 'Artisan Ribbed Mockneck Knit Sweater',
    category: 'Hoodies',
    gender: 'Unisex',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Mineral Sage', hex: '#7A8B79' },
      { name: 'Obsidian Black', hex: '#0C0E14' }
    ],
    price: 4499,
    discountPrice: 3799,
    stock: 20,
    images: [
      '/assets/products/knit_sweater.jpg',
      '/assets/reson/hero_sage.jpg'
    ],
    description: 'Architectural ribbed knit sweater crafted from ethically sourced Merino wool blend. High mockneck collar and structured shoulder silhouette designed for cool climates.',
    fabricDetails: {
      composition: '80% Extra-fine Merino Wool, 20% Technical Polyamide',
      care: 'Hand wash cold, dry flat',
      fit: 'Sculpted Relaxed Fit'
    },
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    numReviews: 29
  },
  {
    name: 'Technical Bonded Bomber Jacket',
    category: 'Jackets',
    gender: 'Unisex',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Stealth Black', hex: '#0a0a0a' },
      { name: 'Dark Slate', hex: '#1e293b' }
    ],
    price: 5499,
    discountPrice: 4699,
    stock: 35,
    images: [
      '/assets/products/bomber_jacket.jpg',
      '/assets/reson/hero_obsidian.jpg'
    ],
    description: 'Engineered from heavyweight water-repellent bonded nylon. Features articulated sleeves, matte gunmetal hardware, deep storm pockets, and custom ribbed trims.',
    fabricDetails: {
      composition: '100% Bonded Technical Nylon Shell',
      care: 'Gentle machine wash cold, hang dry',
      fit: 'Structured Boxy Bomber Fit'
    },
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    numReviews: 32
  },
  {
    name: 'Sculptural Leather Crossbody Sling',
    category: 'Accessories',
    gender: 'Unisex',
    sizes: ['Free Size'],
    colors: [
      { name: 'Noir Black', hex: '#0a0a0a' }
    ],
    price: 4999,
    discountPrice: 4199,
    stock: 14,
    images: [
      '/assets/products/bag_crossbody.jpg',
      '/assets/reson/pedestal_feature.jpg'
    ],
    description: 'Handcrafted from vegetable-tanned full-grain leather. Features titanium matte quick-release buckle, waterproof internal lining, and modular ergonomic strap.',
    fabricDetails: {
      composition: '100% Genuine Full-Grain Italian Leather & Titanium Hardware',
      care: 'Wipe clean with soft damp cloth',
      fit: 'Modular Ergonomic Sling'
    },
    isFeatured: true,
    isNewArrival: true,
    rating: 5.0,
    numReviews: 31
  }
];

const seedData = async () => {
  try {
    console.log('🧹 Clearing existing database collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});

    console.log('👤 Creating initial Admin and Customer accounts...');
    const adminUser = await User.create({
      name: "Harsha's Creation Administrator",
      email: 'admin@harshascreation.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 9876543210',
      addresses: [
        {
          fullName: "Harsha's Creation Atelier HQ",
          street: '108 Atelier Avenue, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          phone: '+91 9876543210',
          isDefault: true
        }
      ]
    });

    const customerUser = await User.create({
      name: 'Rohan Sharma',
      email: 'customer@ownbrand.com',
      password: 'Customer@123',
      role: 'customer',
      phone: '+91 9123456789',
      addresses: [
        {
          fullName: 'Rohan Sharma',
          street: 'Flat 402, Highline Residency, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
          phone: '+91 9123456789',
          isDefault: true
        }
      ]
    });

    console.log('👕 Seeding own-brand apparel catalog...');
    const createdProducts = await Product.insertMany(sampleProducts);

    console.log('💬 Seeding verified customer reviews...');
    await Review.create([
      {
        user: customerUser._id,
        product: createdProducts[0]._id,
        rating: 5,
        title: 'Insane Quality & Drape!',
        comment: 'The 480 GSM fabric feels like luxury streetwear costing 3x as much. Boxy fit is immaculate.',
        isVerified: true
      },
      {
        user: customerUser._id,
        product: createdProducts[1]._id,
        rating: 5,
        title: 'Perfect silhouette',
        comment: 'Fits beautifully over knits. The twill fabric is smooth and weather resistant.',
        isVerified: true
      }
    ]);

    console.log('📦 Creating initial demo order for admin dashboard...');
    await Order.create({
      user: customerUser._id,
      items: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0],
          size: 'L',
          color: 'Onyx Black',
          quantity: 1,
          price: 2899
        },
        {
          product: createdProducts[3]._id,
          name: createdProducts[3].name,
          image: createdProducts[3].images[0],
          size: 'M',
          color: 'Chalk White',
          quantity: 2,
          price: 1199
        }
      ],
      shippingAddress: customerUser.addresses[0],
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      paymentResult: {
        id: 'pay_demo_789456',
        status: 'captured',
        razorpay_order_id: 'order_demo_123456',
        razorpay_payment_id: 'pay_demo_789456',
        update_time: new Date().toISOString(),
        email_address: customerUser.email
      },
      itemsPrice: 5297,
      taxPrice: 265,
      shippingPrice: 0,
      discountAmount: 0,
      totalAmount: 5562,
      status: 'Processing',
      trackingNumber: 'HC-EXP-99281',
      carrier: "Harsha's Creation Express",
      paidAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    });

    console.log('🎉 Database seeded successfully!');
    console.log('--------------------------------------------------');
    console.log('🔑 ADMIN LOGIN:    admin@harshascreation.com    / Admin@123');
    console.log('🔑 CUSTOMER LOGIN: customer@ownbrand.com / Customer@123');
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('❌ Database Seeding Error:', error);
  }
};

// If run directly via node backend/utils/seeder.js
if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB().then(async () => {
    await seedData();
    process.exit(0);
  });
}

module.exports = { seedData };
