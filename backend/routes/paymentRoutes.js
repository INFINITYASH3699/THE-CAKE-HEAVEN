import express from "express";
import {
  processStripePayment,
  createStripeCheckoutSession,
  stripeWebhook,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { paymentValidation } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Payment routes
router.post("/stripe", protect, paymentValidation, processStripePayment);
router.post("/stripe/checkout", protect, createStripeCheckoutSession);

// Webhook - no authentication needed as it comes from Stripe
router.post("/stripe/webhook", stripeWebhook);

export default router;