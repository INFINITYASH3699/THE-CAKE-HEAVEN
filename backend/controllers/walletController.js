import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get wallet details
// @route   GET /api/auth/wallet
// @access  Private
const getWalletDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    balance: user.wallet.balance,
    history: user.wallet.history,
  });
});

// @desc    Add reward points to wallet
// @route   POST /api/auth/wallet/rewards
// @access  Private
const addRewardPoints = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;

  if (!orderId || !amount) {
    res.status(400);
    throw new Error("Please provide order ID and reward amount");
  }

  const user = await User.findById(req.user.id);
  const order = await Order.findById(orderId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Verify the order belongs to the user
  if (order.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to access this order");
  }

  // Add rewards to user's wallet
  user.wallet.balance += Number(amount);

  // Add transaction to wallet history
  user.wallet.history.push({
    amount: Number(amount),
    description: `Reward points for order #${order.orderNumber}`,
    date: new Date(),
    orderId: order._id,
  });

  await user.save();

  res.status(200).json({
    success: true,
    balance: user.wallet.balance,
    message: `${amount} points added to your wallet`,
  });
});

// @desc    Use wallet points for order
// @route   POST /api/auth/wallet/use
// @access  Private
const useWalletPoints = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;

  if (!orderId || !amount) {
    res.status(400);
    throw new Error("Please provide order ID and amount to use");
  }

  const user = await User.findById(req.user.id);
  const order = await Order.findById(orderId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Verify the order belongs to the user
  if (order.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to access this order");
  }

  // Check if user has enough wallet balance
  if (user.wallet.balance < Number(amount)) {
    res.status(400);
    throw new Error("Insufficient wallet balance");
  }

  // Check if order is in a state where payment can be applied
  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  // Deduct amount from wallet
  user.wallet.balance -= Number(amount);

  // Add transaction to wallet history
  user.wallet.history.push({
    amount: -Number(amount),
    description: `Used for order #${order.orderNumber}`,
    date: new Date(),
    orderId: order._id,
  });

  // Update order to reflect wallet payment
  order.walletAmountUsed = Number(amount);

  // If wallet covers the full amount, mark as paid
  if (Number(amount) >= order.totalPrice) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: `wallet-${Date.now()}`,
      status: "COMPLETED",
      update_time: new Date().toISOString(),
      email_address: user.email,
    };

    // If totalPrice is less than wallet amount used, adjust wallet amount used
    if (order.totalPrice < Number(amount)) {
      // Refund the difference
      const refundAmount = Number(amount) - order.totalPrice;
      user.wallet.balance += refundAmount;
      user.wallet.history.push({
        amount: refundAmount,
        description: `Refund for partial wallet payment on order #${order.orderNumber}`,
        date: new Date(),
        orderId: order._id,
      });
      order.walletAmountUsed = order.totalPrice;
    }
  } else {
    // Update totalPrice to reflect partial payment
    const remainingAmount = order.totalPrice - Number(amount);
    order.totalPrice = remainingAmount;
  }

  // Save both user and order
  await Promise.all([user.save(), order.save()]);

  res.status(200).json({
    success: true,
    balance: user.wallet.balance,
    walletAmountUsed: order.walletAmountUsed,
    totalRemaining: order.totalPrice,
    isPaid: order.isPaid,
    message: `${amount} points used for your order`,
  });
});

export { getWalletDetails, addRewardPoints, useWalletPoints };