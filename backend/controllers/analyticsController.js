import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get total orders count
  const totalOrders = await Order.countDocuments();

  // Get total revenue (from paid orders)
  const revenueData = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

  // Get total users
  const totalUsers = await User.countDocuments();

  // Get total products
  const totalProducts = await Product.countDocuments();

  // Get popular products
  const popularProducts = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        count: { $sum: "$orderItems.quantity" },
        name: { $first: "$orderItems.name" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  // Get orders per status
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Get recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name email");

  res.json({
    totalOrders,
    totalRevenue,
    totalUsers,
    totalProducts,
    popularProducts,
    ordersByStatus,
    recentOrders,
  });
});

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = asyncHandler(async (req, res) => {
  // Get sales data by date (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesByDate = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: "$totalPrice" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Get sales by category
  const salesByCategory = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "productData",
      },
    },
    { $unwind: "$productData" },
    {
      $group: {
        _id: "$productData.category",
        sales: {
          $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] },
        },
        count: { $sum: "$orderItems.quantity" },
      },
    },
    { $sort: { sales: -1 } },
  ]);

  // Get top selling products
  const topSellingProducts = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        name: { $first: "$orderItems.name" },
        revenue: {
          $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] },
        },
        quantity: { $sum: "$orderItems.quantity" },
      },
    },
    { $sort: { quantity: -1 } },
    { $limit: 10 },
  ]);

  // Get average order value
  const averageOrderValue = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: null,
        average: { $avg: "$totalPrice" },
        total: { $sum: "$totalPrice" },
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    salesByDate,
    salesByCategory,
    topSellingProducts,
    averageOrderValue:
      averageOrderValue.length > 0
        ? averageOrderValue[0]
        : { average: 0, total: 0, count: 0 },
  });
});

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private/Admin
const getUserAnalytics = asyncHandler(async (req, res) => {
  // Get user registration over time
  const usersByDate = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Get top customers by order value
  const topCustomers = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: "$user",
        totalSpent: { $sum: "$totalPrice" },
        ordersCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userData",
      },
    },
    { $unwind: "$userData" },
    {
      $project: {
        _id: 1,
        name: "$userData.name",
        email: "$userData.email",
        totalSpent: 1,
        ordersCount: 1,
        averageOrderValue: { $divide: ["$totalSpent", "$ordersCount"] },
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 10 },
  ]);

  // Get user retention rate (how many users return to place multiple orders)
  const userRetention = await Order.aggregate([
    {
      $group: {
        _id: "$user",
        orderCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$orderCount",
        userCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    usersByDate,
    topCustomers,
    userRetention,
  });
});

// @desc    Get product analytics
// @route   GET /api/analytics/products
// @access  Private/Admin
const getProductAnalytics = asyncHandler(async (req, res) => {
  // Get top products by revenue
  const topProductsByRevenue = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        name: { $first: "$orderItems.name" },
        revenue: {
          $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] },
        },
        quantity: { $sum: "$orderItems.quantity" },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 },
  ]);

  // Get products by category distribution
  const productsByCategory = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Get low stock products
  const lowStockProducts = await Product.find({
    stock: { $lte: 5 },
    isActive: true,
  })
    .select("name stock category")
    .sort({ stock: 1 })
    .limit(10);

  // Get products ratings distribution
  const ratingsDistribution = await Product.aggregate([
    {
      $group: {
        _id: { $ceil: "$avgRating" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    topProductsByRevenue,
    productsByCategory,
    lowStockProducts,
    ratingsDistribution,
  });
});

export {
  getDashboardStats,
  getSalesAnalytics,
  getUserAnalytics,
  getProductAnalytics,
};
