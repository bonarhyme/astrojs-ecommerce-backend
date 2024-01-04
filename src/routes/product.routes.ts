import { protectUserRoutes } from './../middlewares/user.middleware';
import { protectAdminRoutes } from './../middlewares/admin.middleware';
import express from 'express';
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/product.controllers';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.delete('/:id', protectUserRoutes, protectAdminRoutes, deleteProduct);
router.post('/', protectUserRoutes, protectAdminRoutes, createProduct);
router.put('/:id', protectUserRoutes, protectAdminRoutes, updateProduct);
router.post('/:id/reviews', protectUserRoutes, createProductReview);

export default router;
