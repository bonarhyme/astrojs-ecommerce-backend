import mongoose, { Model } from 'mongoose';

interface IReview {
  name: string;
  rating: number;
  comment: string;
  user: mongoose.Schema.Types.ObjectId;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

interface IProduct {
  user: any;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  reviews: Array<IReview>;
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
}

type ProductModel = Model<IProduct, {}, {}>;

const productSchema = new mongoose.Schema<IProduct, ProductModel, {}>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/** PRoduct model. Use it to run CRUD on any product */
export const Product = mongoose.model<IProduct, ProductModel>('Product', productSchema);
