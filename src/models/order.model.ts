import mongoose, { Model } from 'mongoose';

interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: any;
}

interface IOrder {
  user: any;
  orderItems: Array<OrderItem>;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult: {
    message: string;
    reference: string;
    status: string;
    transactionId: string;
    user: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date | number;
  isDelivered: boolean;
  deliveredAt: Date | number;
}

type OrderModel = Model<IOrder, {}, {}>;

const orderSchema = new mongoose.Schema<IOrder, OrderModel, {}>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      message: { type: String },
      reference: { type: String },
      status: { type: String },
      transactionId: { type: String },
      user: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/** Order mode. RUn CRUD with it */
export const Order = mongoose.model<IOrder, OrderModel>('Order', orderSchema);
