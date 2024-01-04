import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Order } from '../models/order.model';

/**
 * @protected
 * POST request
 * @route /api/orders
 *
 */
export const addOrderItems = asyncHandler(async (req: any, res: Response) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems.length) {
      res.status(400);
      throw new Error('No order items');
    }

    const createdOrder = Order.create({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    if (!createdOrder) {
      res.status(500);
      throw new Error('No order items');
    }

    res.status(201).send(createdOrder);
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @protected
 * GET request
 * @route /api/orders/:id
 * Fetch an order with id
 */
export const getOrderById = asyncHandler(async (req: any, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      res.status(404);
      throw new Error('Order Not found');
    }

    res.send(order);
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @protected
 * Get request'
 * @route /api/orders/:id/pay
 * Use this to make payment
 */

export const updateOrderToPaid = asyncHandler(async (req: any, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order Not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      message: req.body.messge,
      reference: req.body.reference,
      status: req.body.status,
      transactionId: req.body.trans,
      user: order.user.email,
    };

    const updatedOrder = await order.save();

    res.send(updatedOrder);
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @protected
 * GET request
 * @route /api/orders/myorders
 * Controllers to fetch a current user's orders
 */
export const getMyOrders = asyncHandler(async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    if (!orders) {
      res.status(404);
      throw new Error('Order Not found');
    }
    res.send(orders);
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @private for admins
 * GET request
 * @route /api/orders
 * Fetch all the orders in the system
 * TODO: Add pagination and search filter
 */

export const getOrders = asyncHandler(async (req: any, res: Response) => {
  try {
    //This gets the orders and also gets the user name and ID associated with it
    const orders = await Order.find({}).populate('user', 'id name');

    if (!orders.length) {
      res.status(404);
      throw new Error('Orders Not found');
    }
    res.send(orders);
  } catch (error: any) {
    throw new Error(error?.message);
  }
});

/**
 * @private for admins
 * GET request
 * @route /api/orders/:id/deliver
 * COntrollert to update a proposal to delivered
 */
export const updateOrderToDelivered = asyncHandler(async (req: any, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order Not found');
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    if (!updatedOrder) {
      res.status(500);
      throw new Error('Order could not be updated');
    }

    res.send(updatedOrder);
  } catch (error: any) {
    throw new Error(error?.message);
  }
});
