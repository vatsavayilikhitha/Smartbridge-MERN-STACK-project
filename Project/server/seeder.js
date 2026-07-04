import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Cart from './models/Cart.js';

dotenv.config();
connectDB();

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@shopez.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    password: 'user123',
    role: 'user',
  },
];

const sampleProducts = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound. Perfect for work, travel, and music.',
    price: 4999,
    originalPrice: 7999,
    category: 'Electronics',
    brand: 'SoundMax',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    isFeatured: true,
    tags: ['headphones', 'wireless', 'noise-cancelling'],
  },
  {
    name: 'Men\'s Classic Linen Shirt',
    description: 'Breathable premium linen shirt perfect for casual and semi-formal occasions. Available in multiple colors.',
    price: 1299,
    originalPrice: 2499,
    category: 'Clothing',
    brand: 'UrbanThread',
    stock: 120,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'],
    isFeatured: true,
    tags: ['shirt', 'linen', 'men'],
  },
  {
    name: 'Stainless Steel Water Bottle 1L',
    description: 'Double-wall insulated bottle keeps drinks cold for 24hrs and hot for 12hrs. BPA-free and leak-proof.',
    price: 799,
    originalPrice: 1299,
    category: 'Sports',
    brand: 'HydroLife',
    stock: 200,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'],
    isFeatured: true,
    tags: ['bottle', 'hydration', 'sports'],
  },
  {
    name: 'Scented Soy Candle Set',
    description: 'Set of 3 hand-poured soy wax candles in rose, sandalwood, and jasmine scents. 40+ hours burn time each.',
    price: 999,
    originalPrice: 1599,
    category: 'Home & Kitchen',
    brand: 'AromaHaven',
    stock: 80,
    images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500'],
    isFeatured: true,
    tags: ['candles', 'home decor', 'gift'],
  },
  {
    name: 'JavaScript: The Good Parts',
    description: 'A must-read for every JavaScript developer. Douglas Crockford explains the best practices and pitfalls of JS.',
    price: 499,
    originalPrice: 899,
    category: 'Books',
    brand: 'O\'Reilly',
    stock: 60,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'],
    isFeatured: false,
    tags: ['javascript', 'programming', 'books'],
  },
  {
    name: 'Vitamin C Face Serum',
    description: '20% Vitamin C serum with hyaluronic acid and niacinamide. Brightens skin, reduces dark spots, and boosts collagen.',
    price: 699,
    originalPrice: 1199,
    category: 'Beauty',
    brand: 'GlowLab',
    stock: 150,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
    isFeatured: true,
    tags: ['skincare', 'vitamin c', 'serum'],
  },
  {
    name: 'Smart LED Desk Lamp',
    description: 'USB-powered LED desk lamp with touch dimmer, 5 color temperatures, and USB-A charging port. Eye-care certified.',
    price: 1499,
    originalPrice: 2499,
    category: 'Electronics',
    brand: 'LumoBright',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'],
    isFeatured: false,
    tags: ['lamp', 'led', 'desk'],
  },
  {
    name: 'Women\'s Yoga Leggings',
    description: 'High-waist, 4-way stretch leggings made from recycled materials. Sweat-wicking and squat-proof.',
    price: 1799,
    originalPrice: 2999,
    category: 'Sports',
    brand: 'FlexFit',
    stock: 90,
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500'],
    isFeatured: true,
    tags: ['leggings', 'yoga', 'women'],
  },
  {
    name: 'Cast Iron Skillet 10-inch',
    description: 'Pre-seasoned cast iron skillet ideal for searing, baking, frying, and grilling. Works on all heat sources.',
    price: 1599,
    originalPrice: 2499,
    category: 'Home & Kitchen',
    brand: 'IronChef',
    stock: 35,
    images: ['https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=500'],
    isFeatured: false,
    tags: ['cookware', 'cast iron', 'kitchen'],
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'Compact TKL mechanical keyboard with RGB backlight, blue switches, and braided cable. N-key rollover.',
    price: 3499,
    originalPrice: 5999,
    category: 'Electronics',
    brand: 'KeyStrike',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'],
    isFeatured: false,
    tags: ['keyboard', 'gaming', 'mechanical'],
  },
  {
    name: 'Wooden Puzzle 1000 Pieces',
    description: 'High-quality 1000-piece jigsaw puzzle featuring a scenic Indian landscape. Great for family fun.',
    price: 599,
    originalPrice: 999,
    category: 'Toys',
    brand: 'PuzzleCraft',
    stock: 70,
    images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500'],
    isFeatured: false,
    tags: ['puzzle', 'toy', 'family'],
  },
  {
    name: 'Leather Minimalist Wallet',
    description: 'Slim genuine leather bifold wallet with RFID blocking. Holds up to 8 cards and cash. Handcrafted.',
    price: 899,
    originalPrice: 1499,
    category: 'Clothing',
    brand: 'CraftLeather',
    stock: 110,
    images: ['https://images.unsplash.com/photo-1559563458-527698bf5295?w=500'],
    isFeatured: true,
    tags: ['wallet', 'leather', 'minimalist'],
  },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    // Only delete default seed users, preserving any custom users registered by you
    const seedEmails = sampleUsers.map(u => u.email);
    await User.deleteMany({ email: { $in: seedEmails } });

    const createdUsers = await User.create(sampleUsers);
    const adminUser = createdUsers[0]._id;
    const user1 = createdUsers[1]._id;
    const user2 = createdUsers[2]._id;

    const productsWithSeller = sampleProducts.map((p) => ({ ...p, seller: adminUser }));
    const createdProducts = await Product.insertMany(productsWithSeller);

    // Get product references for mock orders
    const headphones = createdProducts.find((p) => p.name.includes('Headphones'));
    const shirt = createdProducts.find((p) => p.name.includes('Shirt'));
    const bottle = createdProducts.find((p) => p.name.includes('Water Bottle'));
    const candle = createdProducts.find((p) => p.name.includes('Candle'));
    const book = createdProducts.find((p) => p.name.includes('JavaScript'));
    const serum = createdProducts.find((p) => p.name.includes('Serum'));

    const mockOrders = [
      {
        user: user1,
        orderItems: [
          { product: headphones._id, name: headphones.name, image: headphones.images[0], price: headphones.price, quantity: 1 },
          { product: shirt._id, name: shirt.name, image: shirt.images[0], price: shirt.price, quantity: 2 },
        ],
        shippingAddress: { street: '12 Ridge Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400006', country: 'India' },
        paymentMethod: 'Card',
        itemsPrice: headphones.price + shirt.price * 2,
        taxPrice: Math.round((headphones.price + shirt.price * 2) * 0.05),
        shippingPrice: 0,
        totalPrice: headphones.price + shirt.price * 2 + Math.round((headphones.price + shirt.price * 2) * 0.05),
        isPaid: true,
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        orderStatus: 'Delivered',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        user: user2,
        orderItems: [
          { product: bottle._id, name: bottle.name, image: bottle.images[0], price: bottle.price, quantity: 1 },
          { product: candle._id, name: candle.name, image: candle.images[0], price: candle.price, quantity: 1 },
        ],
        shippingAddress: { street: '45 Lotus Lane', city: 'Delhi', state: 'Delhi', pincode: '110001', country: 'India' },
        paymentMethod: 'UPI',
        itemsPrice: bottle.price + candle.price,
        taxPrice: Math.round((bottle.price + candle.price) * 0.05),
        shippingPrice: 99,
        totalPrice: bottle.price + candle.price + Math.round((bottle.price + candle.price) * 0.05) + 99,
        isPaid: true,
        paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isDelivered: false,
        orderStatus: 'Processing',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        user: user1,
        orderItems: [
          { product: book._id, name: book.name, image: book.images[0], price: book.price, quantity: 1 },
        ],
        shippingAddress: { street: '12 Ridge Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400006', country: 'India' },
        paymentMethod: 'COD',
        itemsPrice: book.price,
        taxPrice: Math.round(book.price * 0.05),
        shippingPrice: 99,
        totalPrice: book.price + Math.round(book.price * 0.05) + 99,
        isPaid: false,
        isDelivered: false,
        orderStatus: 'Pending',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        user: user2,
        orderItems: [
          { product: serum._id, name: serum.name, image: serum.images[0], price: serum.price, quantity: 3 },
        ],
        shippingAddress: { street: '45 Lotus Lane', city: 'Delhi', state: 'Delhi', pincode: '110001', country: 'India' },
        paymentMethod: 'Card',
        itemsPrice: serum.price * 3,
        taxPrice: Math.round(serum.price * 3 * 0.05),
        shippingPrice: 0,
        totalPrice: serum.price * 3 + Math.round(serum.price * 3 * 0.05),
        isPaid: true,
        paidAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isDelivered: false,
        orderStatus: 'Shipped',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    await Order.insertMany(mockOrders);

    console.log('✅ Data seeded successfully!');
    console.log('📧 Admin: admin@shopez.com | 🔑 Password: admin123');
    console.log('📧 User: priya@example.com | 🔑 Password: user123');
    process.exit();
  } catch (error) {
    console.error(`❌ Seeder error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('🗑️  Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Destroy error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
