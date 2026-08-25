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
      { name: 'Heather Grey', hex: '#71717a' },
      { name: 'Forest Green', hex: '#14532d' }
    ],
    price: 3499,
    discountPrice: 2899,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
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
      { name: 'Camel Tan', hex: '#c29b6f' },
      { name: 'Midnight Charcoal', hex: '#27272a' }
    ],
    price: 6999,
    discountPrice: 5999,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
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
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
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
      { name: 'Sage Green', hex: '#84a98c' },
      { name: 'Dusty Rose', hex: '#d4a373' }
    ],
    price: 1499,
    discountPrice: 1199,
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The foundation of any modern capsule wardrobe. 260 GSM combed cotton featuring a thick 1.25" bound collar that will never bacon or stretch. Pre-shrunk for an enduring silhouette.',
    fabricDetails: {
      composition: '100% Combed Ringspun Cotton (260 GSM)',
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
      { name: 'Earthy Sand', hex: '#d6d3d1' }
    ],
    price: 3899,
    discountPrice: 3299,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
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
    name: 'Artisan Ribbed Modal Midi Dress',
    category: 'Dresses',
    gender: 'Women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Deep Espresso', hex: '#3e2723' },
      { name: 'Soft Cream', hex: '#fdfbf7' }
    ],
    price: 4499,
    discountPrice: 3799,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Flattering body-skimming ribbed knit midi dress with a square neckline, delicate long sleeves, and a discreet side leg slit. Drapes luxuriously for daytime elegance or evening soirees.',
    fabricDetails: {
      composition: '92% Micro Modal, 8% Elastane',
      care: 'Hand wash cold, dry flat',
      fit: 'Bodycon to Subtle Flare'
    },
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    numReviews: 29
  },
  {
    name: 'Pure French Linen Camp Collar Shirt',
    category: 'Shirts',
    gender: 'Unisex',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sky Blue', hex: '#bae6fd' },
      { name: 'Natural Ecru', hex: '#e7e5e4' },
      { name: 'Terracotta', hex: '#c2410c' }
    ],
    price: 2999,
    discountPrice: 2499,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Garment-dyed and stone-washed for ultra-soft breathable comfort. Features a relaxed retro camp collar, straight hem, and natural mother-of-pearl buttons.',
    fabricDetails: {
      composition: '100% Normandy French Linen',
      care: 'Gentle machine wash, warm iron while damp',
      fit: 'Casual Easy Fit'
    },
    isFeatured: false,
    isNewArrival: true,
    rating: 4.6,
    numReviews: 18
  },
  {
    name: 'Utility Cargo Pants with Modular Pockets',
    category: 'Pants',
    gender: 'Unisex',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Olive Drab', hex: '#4d5d53' },
      { name: 'Stealth Black', hex: '#18181b' }
    ],
    price: 3699,
    discountPrice: 2999,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Engineered for functional durability with ripstop cotton weave, articulated knees, cinchable ankle cuffs, and 6 spacious utility compartments.',
    fabricDetails: {
      composition: '100% Cotton Ripstop (320 GSM)',
      care: 'Machine wash cold, air dry',
      fit: 'Tapered Utility Fit'
    },
    isFeatured: false,
    isNewArrival: false,
    rating: 4.7,
    numReviews: 22
  },
  {
    name: 'Sculptural Full-Grain Leather Crossbody',
    category: 'Accessories',
    gender: 'Unisex',
    sizes: ['Free Size'],
    colors: [
      { name: 'Espresso Tan', hex: '#451a03' },
      { name: 'Noir Black', hex: '#0a0a0a' }
    ],
    price: 4999,
    discountPrice: 4199,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Handcrafted from vegetable-tanned full grain leather. Features matte gunmetal hardware, adjustable shoulder strap, water-resistant twill lining, and dedicated phone/card slots.',
    fabricDetails: {
      composition: '100% Genuine Full-Grain Italian Leather',
      care: 'Wipe clean with soft damp cloth, apply leather conditioner',
      fit: 'Modular Daily Carry'
    },
    isFeatured: true,
    isNewArrival: true,
    rating: 5.0,
    numReviews: 31
  },
  {
    name: 'Chunky Knit Wool Turtleneck Sweater',
    category: 'Hoodies',
    gender: 'Women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Oatmeal Heather', hex: '#e6e2dd' },
      { name: 'Ruby Wine', hex: '#881337' }
    ],
    price: 4299,
    discountPrice: 3499,
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Plush ribbed turtleneck sweater knit from ethically sourced Merino wool blend. Offers warmth without bulk, detailed with raglan sleeves and side vents.',
    fabricDetails: {
      composition: '80% Merino Wool, 20% Recycled Polyamide',
      care: 'Hand wash cold, dry flat',
      fit: 'Relaxed Slouchy Fit'
    },
    isFeatured: false,
    isNewArrival: false,
    rating: 4.8,
    numReviews: 17
  },
  {
    name: 'Structured Cotton Oxford Button-Down',
    category: 'Shirts',
    gender: 'Men',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Crisp White', hex: '#ffffff' },
      { name: 'Pale Blue', hex: '#dbeafe' },
      { name: 'Olive Green', hex: '#3f6212' }
    ],
    price: 2799,
    discountPrice: 2299,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A timeless wardrobe essential crafted from 100% heavyweight pinpoint Oxford weave. Finished with button-down collar, single chest pocket, and back box pleat.',
    fabricDetails: {
      composition: '100% Pinpoint Oxford Cotton',
      care: 'Machine wash warm, medium iron',
      fit: 'Custom Tailored Fit'
    },
    isFeatured: false,
    isNewArrival: false,
    rating: 4.6,
    numReviews: 41
  },
  {
    name: 'Cashmere-Blend Beanie & Scarf Set',
    category: 'Accessories',
    gender: 'Unisex',
    sizes: ['Free Size'],
    colors: [
      { name: 'Slate Grey', hex: '#475569' },
      { name: 'Camel Tan', hex: '#b45309' },
      { name: 'Jet Black', hex: '#1e293b' }
    ],
    price: 2499,
    discountPrice: 1999,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultra-soft cold weather duo woven with 30% Mongolian Cashmere and fine Merino wool. Delivers unparalleled softness and lightweight insulation.',
    fabricDetails: {
      composition: '30% Mongolian Cashmere, 70% Extra-fine Merino Wool',
      care: 'Hand wash cold or dry clean',
      fit: 'One Size Fits All'
    },
    isFeatured: false,
    isNewArrival: true,
    rating: 4.9,
    numReviews: 33
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
      name: 'Aura Brand Administrator',
      email: 'admin@ownbrand.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 9876543210',
      addresses: [
        {
          fullName: 'Aura Wear HQ',
          street: '108 Fashion Avenue, Indiranagar',
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
      trackingNumber: 'AURA-EXP-99281',
      carrier: 'Aura Logistics Express',
      paidAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    });

    console.log('🎉 Database seeded successfully!');
    console.log('--------------------------------------------------');
    console.log('🔑 ADMIN LOGIN:    admin@ownbrand.com    / Admin@123');
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
