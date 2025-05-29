// routes/orderRoutes.js
import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  shipOrder,
  getRiderOrders,
  updateDeliveryStatus
} from '../controllers/orderController.js';

import {
  isAuthenticated,
  isAdmin,
  isRider
} from '../middlewares/authorizeMiddleware.js';

const router = express.Router();

// Customer
router.post('/',            isAuthenticated, createOrder);
router.get('/my',           isAuthenticated, getUserOrders);
router.get('/:id',          isAuthenticated, getOrderById);

// Admin
router.get('/',             isAuthenticated, isAdmin,      getAllOrders);
router.patch('/:id/ship',   isAuthenticated, isAdmin,      shipOrder);

// Rider PWA
router.get('/rider/orders', isAuthenticated, isRider,      getRiderOrders);
router.patch('/:id/deliver',isAuthenticated, isRider,      updateDeliveryStatus);

export default router;
