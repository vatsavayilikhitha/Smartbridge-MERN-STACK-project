import express from 'express';
import {
  getUsers,
  getUserById,
  updateProfile,
  deleteUser,
  updateUserRole,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.put('/profile', protect, updateProfile);
router.get('/:id', protect, admin, getUserById);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/role', protect, admin, updateUserRole);

export default router;
