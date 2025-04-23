// authRoutes.js

import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  forgotPassword,
  resetPassword,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getAllUsers,
  updateUserStatus,
  adminResetPassword,
} from "../controllers/authController.js";
import {
  getWalletDetails,
  addRewardPoints,
  useWalletPoints,
} from "../controllers/walletController.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // Correctly import both middlewares
import { uploadSingle } from "../middleware/uploadMiddleware.js";
import {
  registerValidation,
  loginValidation,
  addressValidation,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Authentication routes
router.post("/signup", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

// User profile routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, uploadSingle, updateUserProfile);

// Address management
router.post("/profile/address", protect, addressValidation, addAddress);
router.put(
  "/profile/address/:addressId",
  protect,
  addressValidation,
  updateAddress
);
router.delete("/profile/address/:addressId", protect, deleteAddress);

// Wallet management
router.get("/wallet", protect, getWalletDetails);
router.post("/wallet/rewards", protect, addRewardPoints);
router.post("/wallet/use", protect, useWalletPoints);

// Favorites management
router.get("/favorites", protect, getFavorites);
router.post("/favorites/:productId", protect, addToFavorites);
router.delete("/favorites/:productId", protect, removeFromFavorites);

// Admin routes
router.get("/admin/users", protect, admin, getAllUsers);
router.patch("/users/:userId/status", protect, admin, updateUserStatus);
router.post("/users/:userId/reset-password", protect, admin, adminResetPassword);

export default router;  