import express from "express";
import {
  getDashboardStats,
  getSalesAnalytics,
  getUserAnalytics,
  getProductAnalytics,
} from "../controllers/analyticsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require admin access
router.use(protect, admin);

// Routes
router.get("/dashboard", getDashboardStats);
router.get("/sales", getSalesAnalytics);
router.get("/users", getUserAnalytics);
router.get("/products", getProductAnalytics);

export default router;