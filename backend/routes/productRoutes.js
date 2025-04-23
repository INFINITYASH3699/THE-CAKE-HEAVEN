import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getFilterOptions,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  getProductCategories,
  getFeaturedProducts,
  getRelatedProducts,
} from "../controllers/productController.js";
import { protect, admin, optionalAuth } from "../middleware/authMiddleware.js";
import { uploadMultiple } from "../middleware/uploadMiddleware.js";
import {
  productValidation,
  idValidation,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/filter-options", getFilterOptions);
router.get("/categories", getProductCategories);
router.get("/featured", getFeaturedProducts);
router.get("/:id", idValidation, getProductById);
router.get("/:id/related", idValidation, getRelatedProducts);

// Admin routes
router.post(
  "/",
  protect,
  admin,
  uploadMultiple,
  productValidation,
  createProduct
);
router.put("/:id", protect, admin, idValidation, uploadMultiple, updateProduct);
router.delete("/:id", protect, admin, idValidation, deleteProduct);

// Review routes
router.post("/:id/reviews", protect, idValidation, createProductReview);
router.put("/:id/reviews/:reviewId", protect, updateProductReview);
router.delete("/:id/reviews/:reviewId", protect, deleteProductReview);

export default router;