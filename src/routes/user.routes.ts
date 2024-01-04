import {
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  login,
  register,
  updateUser,
  updateUserProfile,
} from './../controllers/user.controllers';
import express from 'express';
import { protectUserRoutes } from '../middlewares/user.middleware';
import { protectAdminRoutes } from '../middlewares/admin.middleware';

const router = express.Router();

// TODO: Add other authentication endpoints
// Such as reset password, forget password, etc

router.post('/register', register);
router.post('/login', login);
router.get('/', protectUserRoutes, protectAdminRoutes, getUsers);
router.get('/profile', protectUserRoutes, getUserProfile);
router.put('/profile', protectUserRoutes, updateUserProfile);
router.delete('/:id', protectUserRoutes, protectAdminRoutes, deleteUser);
router.get('/:id', protectUserRoutes, protectAdminRoutes, getUserById);
router.put('/:id', protectUserRoutes, protectAdminRoutes, updateUser);

export default router;
