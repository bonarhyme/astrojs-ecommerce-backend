import { protectAdminRoutes } from './../middlewares/admin.middleware';
import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} from '../controllers/order.controller';
import { protectUserRoutes } from '../middlewares/user.middleware';
import { reduceCountInStock } from '../middlewares/product.middleware';

const router = express.Router();

router.post('/', protectUserRoutes, addOrderItems);
router.get('/', protectUserRoutes, protectAdminRoutes, getOrders);
router.get('/myorders', protectUserRoutes, getMyOrders);
router.get('/:id', protectUserRoutes, getOrderById);
router.put('/:id/pay', protectUserRoutes, reduceCountInStock, updateOrderToPaid);
router.put('/:id/deliver', protectUserRoutes, protectAdminRoutes, updateOrderToDelivered);

export default router;
