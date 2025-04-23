// routes/couponRoutes.js (corrected route order)
import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getActiveCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
  getProductCoupons,
} from "../controllers/couponController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { couponValidation, validateRequest } from "../middleware/validationMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Simple validation for public coupon validation
const validateCouponRequest = [
  body("code").notEmpty().withMessage("Coupon code is required"),
  body("cartTotal")
    .notEmpty()
    .withMessage("Cart total is required")
    .isNumeric()
    .withMessage("Cart total must be a number"),
  validateRequest,
];

// Admin routes - require authentication and admin role
router.post("/", protect, admin, couponValidation, createCoupon);
router.get("/", protect, admin, getAllCoupons);

// Public routes - no authentication required (must be before the /:id route)
router.get("/active", getActiveCoupons); 
router.post("/validate", validateCouponRequest, validateCoupon);
router.post("/apply", protect, applyCoupon);
router.get("/product-coupons", getProductCoupons);

// Parameter routes - must come after specific routes
router.get("/:id", protect, admin, getCouponById);
router.put("/:id", protect, admin, updateCoupon);
router.delete("/:id", protect, admin, deleteCoupon);

export default router;