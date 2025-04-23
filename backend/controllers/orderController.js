import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../utils/emailService.js";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    orderDetails,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    discountAmount,
    couponCode,
    totalPrice,
    walletAmountUsed,
    deliveryOption,
    isPaid,
    useWalletPoints,
  } = req.body;

  if (!orderItems || !orderItems.length || !shippingAddress) {
    res.status(400);
    throw new Error("Missing required order information");
  }

  // Generate order number explicitly as a backup
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}${month}${day}`;
  
  // Combine timestamp and random number for guaranteed uniqueness
  const timestamp = Date.now().toString().slice(-5);
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
  
  const orderNumber = `CAKE-${dateString}-${timestamp}${randomPart}`;
  console.log("Generated order number in controller:", orderNumber);

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Check inventory first
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.product}`);
      }
      
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Not enough stock for ${product.name}. Available: ${product.stock}`);
      }
    }

    // Create the new order
    const order = new Order({
      user: req.user.id,
      orderNumber, // Set explicitly to avoid validation errors
      orderItems,
      shippingAddress,
      orderDetails,
      paymentMethod,
      itemsPrice: itemsPrice || 0,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || "",
      totalPrice: totalPrice || 0,
      walletAmountUsed: walletAmountUsed || 0,
      deliveryOption: deliveryOption || "standard",
      isPaid: isPaid || false,
      status: "processing",
      isDelivered: false,
      statusHistory: [
        {
          status: "processing",
          date: new Date(),
          comment: "Order placed",
        },
      ],
    });

    // Set estimated delivery date based on delivery option
    const today = new Date();
    if (deliveryOption === "same-day") {
      // Same day - add 12 hours
      order.estimatedDeliveryDate = new Date(
        today.getTime() + 12 * 60 * 60 * 1000
      );
    } else if (deliveryOption === "express") {
      // Express - add 1 day
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      order.estimatedDeliveryDate = tomorrow;
    } else {
      // Standard - add 3 days
      const standardDate = new Date(today);
      standardDate.setDate(standardDate.getDate() + 3);
      order.estimatedDeliveryDate = standardDate;
    }

    // Save the order
    const savedOrder = await order.save();
    console.log("Order saved successfully with ID:", savedOrder._id);
    console.log("Saved order number:", savedOrder.orderNumber);

    // If wallet points are used, update wallet balance
    if (useWalletPoints && walletAmountUsed > 0) {
      // Make sure wallet exists
      if (!user.wallet) {
        user.wallet = {
          balance: 0,
          history: [],
        };
      }

      // Check if user has enough balance
      if (user.wallet.balance < walletAmountUsed) {
        res.status(400);
        throw new Error("Insufficient wallet balance");
      }

      // Deduct points from wallet
      user.wallet.balance = Math.max(0, user.wallet.balance - walletAmountUsed);

      // Add transaction to history
      user.wallet.history.push({
        amount: -walletAmountUsed,
        description: `Points used for order #${savedOrder.orderNumber}`,
        date: new Date(),
        orderId: savedOrder._id,
      });
    }

    // Add reward points (10% of order total)
    const rewardPoints = Math.round(totalPrice * 0.1);

    // Update wallet with reward points
    if (!user.wallet) {
      user.wallet = {
        balance: rewardPoints,
        history: [],
      };
    } else {
      user.wallet.balance += rewardPoints;
    }

    user.wallet.history.push({
      amount: rewardPoints,
      description: `Reward points for order #${savedOrder.orderNumber}`,
      date: new Date(),
      orderId: savedOrder._id,
    });

    await user.save();

    // Update product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    // Send order confirmation email
    try {
      await sendEmail({
        email: user.email,
        subject: `Cake Heaven - Order #${savedOrder.orderNumber} Confirmation`,
        message: `
          Dear ${user.name},
          
          Thank you for your order! Your order #${
            savedOrder.orderNumber
          } has been received and is being processed.
          
          Order Details:
          - Total Amount: ₹${savedOrder.totalPrice}
          - Payment Method: ${savedOrder.paymentMethod}
          - Estimated Delivery: ${savedOrder.estimatedDeliveryDate.toDateString()}
          
          You earned ${rewardPoints} reward points with this purchase!
          
          Track your order status in your account dashboard.
          
          Thank you for shopping with Cake Heaven!
        `,
      });
    } catch (error) {
      console.error("Error sending order confirmation email:", error);
      // Continue processing even if email fails
    }

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
      walletAmountUsed,
      rewardPointsEarned: rewardPoints,
      currentWalletBalance: user.wallet.balance,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(400);
    throw new Error(`Failed to create order: ${error.message}`);
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  // Pagination
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.page) || 1;

  // Filtering
  const keyword = req.query.keyword
    ? {
        orderNumber: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  // Status filter
  const statusFilter = req.query.status ? { status: req.query.status } : {};

  // Date filter
  const dateFilter = {};
  if (req.query.startDate && req.query.endDate) {
    dateFilter.createdAt = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate),
    };
  }

  const count = await Order.countDocuments({
    ...keyword,
    ...statusFilter,
    ...dateFilter,
  });

  const orders = await Order.find({
    ...keyword,
    ...statusFilter,
    ...dateFilter,
  })
    .populate("user", "id name email")
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.page) || 1;

  const count = await Order.countDocuments({ user: req.user.id });

  const orders = await Order.find({ user: req.user.id })
    .sort("-createdAt")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check if user is authorized to view this order
  if (String(order.user._id) !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to access this order");
  }

  res.json(order);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, comment } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Update status
  order.status = status;

  // Add status history
  order.statusHistory.push({
    status: status,
    date: new Date(),
    comment: comment || "",
  });

  // If status is delivered, update isDelivered and deliveredAt
  if (status === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  // If status is cancelled, add cancel reason
  if (status === "cancelled") {
    order.cancelReason = comment || "Cancelled by admin";
  }

  const updatedOrder = await order.save();

  // Send email notification to customer
  try {
    const user = await User.findById(order.user);
    if (user) {
      let emailSubject = `Order #${order.orderNumber} Status Updated`;
      let emailMessage = `
        Dear ${user.name},
        
        Your order #${
          order.orderNumber
        } status has been updated to: ${status.toUpperCase()}.
      `;

      if (comment) {
        emailMessage += `\nAdditional information: ${comment}`;
      }

      if (status === "shipped") {
        emailMessage += `\n\nYour order is on its way! Estimated delivery date: ${order.estimatedDeliveryDate.toDateString()}`;
      } else if (status === "delivered") {
        emailMessage += `\n\nYour order has been delivered. Thank you for shopping with Cake Heaven!`;
      } else if (status === "cancelled") {
        emailMessage += `\n\nIf you have any questions regarding the cancellation, please contact our customer support.`;
      }

      await sendEmail({
        email: user.email,
        subject: emailSubject,
        message: emailMessage,
      });
    }
  } catch (error) {
    console.error("Error sending status update email:", error);
  }

  res.json(updatedOrder);
});

// @desc    Update order payment status
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentResult } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check if user is authorized or is admin
  if (String(order.user) !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this order");
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = {
    id: paymentResult.id,
    status: paymentResult.status,
    update_time: paymentResult.update_time,
    email_address: paymentResult.email_address,
  };

  // Add status history entry
  order.statusHistory.push({
    status: order.status,
    date: new Date(),
    comment: "Payment completed",
  });

  const updatedOrder = await order.save();

  // Add reward points to user's wallet (10% of order total)
  const user = await User.findById(order.user);

  if (user) {
    const rewardPoints = Math.round(order.totalPrice * 0.1);

    if (!user.wallet) {
      user.wallet = {
        balance: rewardPoints,
        history: [],
      };
    } else {
      user.wallet.balance += rewardPoints;
    }

    user.wallet.history.push({
      amount: rewardPoints,
      description: `Reward points for order #${order.orderNumber}`,
      date: new Date(),
      orderId: order._id,
    });

    await user.save();

    // Send payment confirmation email
    try {
      await sendEmail({
        email: user.email,
        subject: `Payment Confirmation - Order #${order.orderNumber}`,
        message: `
          Dear ${user.name},
          
          Your payment for order #${order.orderNumber} has been received and confirmed.
          
          Order Details:
          - Total Amount: $${order.totalPrice}
          - Payment Method: ${order.paymentMethod}
          - Payment ID: ${paymentResult.id}
          
          You've earned ${rewardPoints} reward points with this purchase!
          
          Thank you for shopping with Cake Heaven!
        `,
      });
    } catch (error) {
      console.error("Error sending payment confirmation email:", error);
    }
  }

  res.json(updatedOrder);
});

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Only the user who created the order or an admin can cancel it
  if (String(order.user) !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to cancel this order");
  }

  // Can only cancel if not delivered
  if (order.isDelivered) {
    res.status(400);
    throw new Error("Cannot cancel an order that has been delivered");
  }

  // Can only cancel if not cancelled already
  if (order.status === "cancelled") {
    res.status(400);
    throw new Error("Order is already cancelled");
  }

  // Update order status
  order.status = "cancelled";
  order.cancelReason = reason || "Cancelled by customer";

  // Add to status history
  order.statusHistory.push({
    status: "cancelled",
    date: new Date(),
    comment: reason || "Cancelled by customer",
  });

  // If order was paid, initiate refund process
  if (order.isPaid) {
    // In a real application, you would have refund logic here
    // For this example, we'll just note it in the status history
    order.statusHistory.push({
      status: "refunded",
      date: new Date(),
      comment: "Refund initiated for cancelled order",
    });
  }

  // If wallet points were used, refund them
  if (order.walletAmountUsed > 0) {
    const user = await User.findById(order.user);

    if (user) {
      user.wallet.balance += order.walletAmountUsed;

      user.wallet.history.push({
        amount: order.walletAmountUsed,
        description: `Refund for cancelled order #${order.orderNumber}`,
        date: new Date(),
        orderId: order._id,
      });

      await user.save();
    }
  }

  // Return products to inventory
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  const updatedOrder = await order.save();

  // Send cancellation email
  try {
    const user = await User.findById(order.user);
    if (user) {
      await sendEmail({
        email: user.email,
        subject: `Order #${order.orderNumber} Cancelled`,
        message: `
          Dear ${user.name},
          
          Your order #${order.orderNumber} has been cancelled.
          
          Reason: ${order.cancelReason}
          
          ${
            order.isPaid
              ? "A refund will be processed to your original payment method."
              : ""
          }
          ${
            order.walletAmountUsed > 0
              ? `${order.walletAmountUsed} wallet points have been returned to your account.`
              : ""
          }
          
          If you have any questions, please contact our customer support.
          
          Thank you for your understanding.
        `,
      });
    }
  } catch (error) {
    console.error("Error sending cancellation email:", error);
  }

  res.json(updatedOrder);
});

// @desc    Delete an order (Admin only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  await order.deleteOne();

  res.json({ message: "Order removed" });
});

// @desc    Get order counts by status
// @route   GET /api/orders/status-counts
// @access  Private/Admin
const getOrderStatusCounts = asyncHandler(async (req, res) => {
  const statusCounts = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Convert to a more convenient format
  const result = {};
  statusCounts.forEach((item) => {
    result[item._id] = item.count;
  });

  res.json(result);
});

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderPaymentStatus,
  cancelOrder,
  deleteOrder,
  getOrderStatusCounts,
};
