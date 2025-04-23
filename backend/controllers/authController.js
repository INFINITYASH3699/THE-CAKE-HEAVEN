import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import crypto from "crypto";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../utils/emailService.js";

dotenv.config();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    wallet: {
      balance: 100,
      history: [
        {
          amount: 100,
          description: "Signup bonus",
          date: new Date(),
        },
      ],
    },
  });

  if (user) {
    // Send welcome email
    try {
      await sendEmail({
        email: user.email,
        subject: "Welcome to Cake Heaven!",
        message: `Hi ${user.name},\n\nThank you for registering with Cake Heaven. We've added 100 bonus points to your wallet to get you started.\n\nHappy Shopping!`,
      });
    } catch (error) {
      console.error("Welcome email could not be sent", error);
    }

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      wallet: user.wallet,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error("Account is inactive or has been deactivated");
  }

  if (user && (await user.matchPassword(password))) {
    // Update last login time
    user.lastLogin = Date.now();
    await user.save();

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      wallet: user.wallet,
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    addresses: user.addresses || [],
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    wallet: user.wallet,
    favorites: user.favorites,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
  user.gender = req.body.gender || user.gender;
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

  if (req.file) {
    user.profileImage = req.file.path;
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    addresses: updatedUser.addresses,
    dateOfBirth: updatedUser.dateOfBirth,
    gender: updatedUser.gender,
    phoneNumber: updatedUser.phoneNumber,
    profileImage: updatedUser.profileImage,
    wallet: updatedUser.wallet,
    favorites: updatedUser.favorites,
    token: generateToken(updatedUser.id),
  });
});

// @desc    Add new address
// @route   POST /api/auth/profile/address
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // If addresses array doesn't exist, initialize it
  if (!user.addresses) {
    user.addresses = [];
  }

  // Check if this is the first address or if isDefault is true
  const isDefault = req.body.isDefault || user.addresses.length === 0;

  // If new address is default, set all other addresses to non-default
  if (isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  // Add new address
  user.addresses.push({
    ...req.body,
    isDefault,
  });

  await user.save();

  res.status(201).json({
    message: "Address added successfully",
    addresses: user.addresses,
  });
});

// @desc    Update address
// @route   PUT /api/auth/profile/address/:addressId
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find the address index
  const addressIndex = user.addresses.findIndex(
    (addr) => addr._id.toString() === addressId
  );

  if (addressIndex === -1) {
    res.status(404);
    throw new Error("Address not found");
  }

  // Check if this address should be set as default
  if (req.body.isDefault) {
    // Set all addresses to non-default
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  // Update the address
  user.addresses[addressIndex] = {
    ...user.addresses[addressIndex].toObject(),
    ...req.body,
  };

  await user.save();

  res.json({
    message: "Address updated successfully",
    addresses: user.addresses,
  });
});

// @desc    Delete address
// @route   DELETE /api/auth/profile/address/:addressId
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Get the address that will be deleted
  const addressToDelete = user.addresses.find(
    (addr) => addr._id.toString() === addressId
  );

  if (!addressToDelete) {
    res.status(404);
    throw new Error("Address not found");
  }

  // Check if the address being deleted is the default
  const isDefault = addressToDelete.isDefault;

  // Filter out the address to delete
  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== addressId
  );

  // If we deleted the default address and there are still addresses left,
  // set the first one as default
  if (isDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.json({
    message: "Address deleted successfully",
    addresses: user.addresses,
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please visit: ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error("Email could not be sent");
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful. Please log in with your new password.",
  });
});

// @desc    Add product to favorites
// @route   POST /api/auth/favorites/:productId
// @access  Private
const addToFavorites = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Initialize favorites array if it doesn't exist
  if (!user.favorites) {
    user.favorites = [];
  }

  // Check if product already in favorites
  if (user.favorites.includes(productId)) {
    res.status(400);
    throw new Error("Product already in favorites");
  }

  user.favorites.push(productId);
  await user.save();

  res.status(200).json({
    message: "Product added to favorites",
    favorites: user.favorites,
  });
});

// @desc    Remove product from favorites
// @route   DELETE /api/auth/favorites/:productId
// @access  Private
const removeFromFavorites = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.favorites || !user.favorites.includes(productId)) {
    res.status(400);
    throw new Error("Product not in favorites");
  }

  user.favorites = user.favorites.filter((id) => id.toString() !== productId);
  await user.save();

  res.status(200).json({
    message: "Product removed from favorites",
    favorites: user.favorites,
  });
});

// @desc    Get user favorites
// @route   GET /api/auth/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("favorites");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    count: user.favorites ? user.favorites.length : 0,
    favorites: user.favorites || [],
  });
});

// @desc    Get all users (admin only)
// @route   GET /api/auth/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");

  res.json(users);
});

const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the isActive status based on the request body
    user.isActive = req.body.isActive;

    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const adminResetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Set reset token and expiry
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;

    // Create message
    const message = `You are receiving this email because an administrator has requested to reset your password. Please click the link below to reset your password:\n\n${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset request",
        message,
      });

      res.json({ success: true, message: "Password reset email sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Export all controllers
export {
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
};
