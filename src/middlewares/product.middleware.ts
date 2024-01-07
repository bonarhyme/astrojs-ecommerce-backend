import { NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';

/** Use this to reduce the count in stock of a product */
export const reduceCountInStock = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    const orderItems = order?.orderItems;

    // console.log({ orderItems, orderId });

    // if (true) {
    //   throw new Error('Some Error');
    // } else {
    //   next();
    // }

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      orderItems?.map(async (item: any) => {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock = product.countInStock - item.qty;
          await product.save();
          console.log({ countInStockProduct: product });
        }

        return item;
      });
      next();
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
});
