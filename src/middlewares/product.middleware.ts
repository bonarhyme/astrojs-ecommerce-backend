import { NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Product } from '../models/product.model';

/** Use this to reduce the count in stock of a product */
export const reduceCountInStock = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  const { orderItems } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    orderItems.map(async (item: any) => {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock = product.countInStock - item.qty;
        await product.save();
      }

      return item;
    });
    next();
  }
});
