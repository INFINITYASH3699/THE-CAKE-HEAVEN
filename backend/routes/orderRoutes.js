import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderPaymentStatus,
  cancelOrder,
  deleteOrder,
  getOrderStatusCounts,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  orderValidation,
  idValidation,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// User routes
router.post("/", protect, orderValidation, createOrder);
router.get("/myorders", protect, getUserOrders);
router.get("/:id", protect, idValidation, getOrderById);
router.put("/:id/pay", protect, idValidation, updateOrderPaymentStatus);
router.put("/:id/cancel", protect, idValidation, cancelOrder);

// Admin routes
router.get("/", protect, admin, getAllOrders);
router.get("/status-counts", protect, admin, getOrderStatusCounts);
router.put("/:id/status", protect, admin, idValidation, updateOrderStatus);
router.delete("/:id", protect, admin, idValidation, deleteOrder);

export default router;