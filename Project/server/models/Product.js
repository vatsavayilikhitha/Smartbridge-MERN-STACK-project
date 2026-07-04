import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    description: { type: String, required: [true, 'Product description is required'] },
    price: { type: Number, required: [true, 'Product price is required'], min: 0 },
    originalPrice: { type: Number, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Other'],
    },
    brand: { type: String, default: '' },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }],
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
