import Coupon from "../models/couponModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountAmount,
    minimumPurchase,
    maximumDiscount,
    validFrom,
    validUntil,
    isActive,
    applicableTo,
    applicableProducts,
    applicableCategories,
    applicableUsers,
    usageLimit,
    perUserLimit,
  } = req.body;

  // Check if coupon code already exists
  const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
  if (couponExists) {
    res.status(400);
    throw new Error("Coupon code already exists");
  }

  const coupon = new Coupon({
    code: code.toUpperCase(),
    description,
    discountType,
    discountAmount: Number(discountAmount),
    minimumPurchase: minimumPurchase ? Number(minimumPurchase) : 0,
    maximumDiscount: maximumDiscount ? Number(maximumDiscount) : null,
    validFrom: validFrom || new Date(),
    validUntil,
    isActive: isActive === undefined ? true : isActive,
    applicableTo: applicableTo || "all",
    applicableProducts: applicableProducts || [],
    applicableCategories: applicableCategories || [],
    applicableUsers: applicableUsers || [],
    usageLimit: usageLimit ? Number(usageLimit) : null,
    perUserLimit: perUserLimit ? Number(perUserLimit) : null,
    usageCount: 0,
    usedBy: [],
  });

  const createdCoupon = await coupon.save();
  res.status(201).json(createdCoupon);
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
});

// @desc    Get active coupons
// @route   GET /api/coupons/active
// @access  Public
const getActiveCoupons = asyncHandler(async (req, res) => {
  const now = new Date();

  // Find all active coupons
  const coupons = await Coupon.find({
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
  });

  // If user is not authenticated, filter out user-specific coupons
  const filteredCoupons = req.user
    ? coupons
    : coupons.filter(
        (coupon) =>
          coupon.applicableTo !== "user" || coupon.applicableUsers.length === 0
      );

  res.json(filteredCoupons);
});

// @desc    Get coupon by ID
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    res.json(coupon);
  } else {
    res.status(404);
    throw new Error("Coupon not found");
  }
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  // Update fields
  const {
    code,
    description,
    discountType,
    discountAmount,
    minimumPurchase,
    maximumDiscount,
    validFrom,
    validUntil,
    isActive,
    applicableTo,
    applicableProducts,
    applicableCategories,
    applicableUsers,
    usageLimit,
    perUserLimit,
  } = req.body;

  // If updating code, check if the new code already exists
  if (code && code !== coupon.code) {
    const codeExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (codeExists) {
      res.status(400);
      throw new Error("Coupon code already exists");
    }
    coupon.code = code.toUpperCase();
  }

  // Update other fields
  coupon.description = description || coupon.description;
  coupon.discountType = discountType || coupon.discountType;
  coupon.discountAmount =
    discountAmount !== undefined
      ? Number(discountAmount)
      : coupon.discountAmount;
  coupon.minimumPurchase =
    minimumPurchase !== undefined
      ? Number(minimumPurchase)
      : coupon.minimumPurchase;
  coupon.maximumDiscount =
    maximumDiscount !== undefined
      ? Number(maximumDiscount)
      : coupon.maximumDiscount;
  coupon.validFrom = validFrom || coupon.validFrom;
  coupon.validUntil = validUntil || coupon.validUntil;
  coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;
  coupon.applicableTo = applicableTo || coupon.applicableTo;

  if (applicableProducts) {
    coupon.applicableProducts = applicableProducts;
  }

  if (applicableCategories) {
    coupon.applicableCategories = applicableCategories;
  }

  if (applicableUsers) {
    coupon.applicableUsers = applicableUsers;
  }

  coupon.usageLimit =
    usageLimit !== undefined ? Number(usageLimit) : coupon.usageLimit;
  coupon.perUserLimit =
    perUserLimit !== undefined ? Number(perUserLimit) : coupon.perUserLimit;

  const updatedCoupon = await coupon.save();
  res.json(updatedCoupon);
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  await coupon.deleteOne();
  res.json({ message: "Coupon removed" });
});

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, cartTotal, products } = req.body;

  if (!code) {
    res.status(400);
    throw new Error("Coupon code is required");
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() },
  });

  if (!coupon) {
    res.status(404);
    throw new Error("Invalid or expired coupon code");
  }

  // Check minimum purchase
  if (coupon.minimumPurchase > 0 && cartTotal < coupon.minimumPurchase) {
    res.status(400);
    throw new Error(
      `Minimum purchase of $${coupon.minimumPurchase} required for this coupon`
    );
  }

  // Check usage limit
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error("Coupon usage limit has been reached");
  }

  // User-specific checks only if user is authenticated
  if (req.user) {
    // Check per user limit
    if (coupon.perUserLimit !== null) {
      const userUsageCount = coupon.usedBy.filter(
        (usage) => usage.user.toString() === req.user.id
      ).length;

      if (userUsageCount >= coupon.perUserLimit) {
        res.status(400);
        throw new Error(
          `You've already used this coupon ${userUsageCount} times (limit: ${coupon.perUserLimit})`
        );
      }
    }

    // Check if applicable to specific users
    if (
      coupon.applicableTo === "user" &&
      coupon.applicableUsers.length > 0 &&
      !coupon.applicableUsers.includes(req.user.id)
    ) {
      res.status(400);
      throw new Error("This coupon is not applicable to your account");
    }
  } else if (coupon.applicableTo === "user") {
    // If coupon is user-specific but no user is authenticated
    res.status(401);
    throw new Error("Login required to use this coupon");
  }

  // Check if applicable to specific products
  if (coupon.applicableTo === "product" && products) {
    const productIds = products.map((p) => p.product);
    const validForAny = productIds.some((id) =>
      coupon.applicableProducts.includes(id)
    );

    if (!validForAny) {
      res.status(400);
      throw new Error(
        "Coupon is not applicable to any of the products in your cart"
      );
    }
  }

  // Calculate discount
  let discountAmount = 0;

  if (coupon.discountType === "percentage") {
    discountAmount = (cartTotal * coupon.discountAmount) / 100;

    // Apply maximum discount if set
    if (
      coupon.maximumDiscount !== null &&
      discountAmount > coupon.maximumDiscount
    ) {
      discountAmount = coupon.maximumDiscount;
    }
  } else {
    // Fixed amount discount
    discountAmount = coupon.discountAmount;

    // Ensure discount doesn't exceed cart total
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }
  }

  res.json({
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountAmount,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    message: `Coupon applied: ${coupon.description}`,
  });
});

// @desc    Apply coupon to order
// @route   POST /api/coupons/apply
// @access  Private
const applyCoupon = asyncHandler(async (req, res) => {
  const { code, orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check if user is authorized
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to modify this order");
  }

  // Validate coupon code
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() },
  });

  if (!coupon) {
    res.status(404);
    throw new Error("Invalid or expired coupon code");
  }

  // Calculate discount
  let discountAmount = 0;

  if (coupon.discountType === "percentage") {
    discountAmount = (order.itemsPrice * coupon.discountAmount) / 100;

    // Apply maximum discount if set
    if (
      coupon.maximumDiscount !== null &&
      discountAmount > coupon.maximumDiscount
    ) {
      discountAmount = coupon.maximumDiscount;
    }
  } else {
    // Fixed amount discount
    discountAmount = coupon.discountAmount;

    // Ensure discount doesn't exceed order total
    if (discountAmount > order.itemsPrice) {
      discountAmount = order.itemsPrice;
    }
  }

  // Update order
  order.discountAmount = discountAmount;
  order.couponCode = coupon.code;
  order.totalPrice =
    order.itemsPrice + order.shippingPrice + order.taxPrice - discountAmount;

  // Update coupon usage
  coupon.usageCount += 1;
  coupon.usedBy.push({
    user: req.user.id,
    usedAt: new Date(),
    orderId: order._id,
  });

  // Save both documents
  await Promise.all([order.save(), coupon.save()]);

  res.json({
    success: true,
    message: `Coupon applied: ${discountAmount.toFixed(2)} discount`,
    order,
  });
});

// @desc    Get coupons applicable to a specific product
// @route   GET /api/coupons/product-coupons
// @access  Public
const getProductCoupons = asyncHandler(async (req, res) => {
  const { productId, categoryId } = req.query;
  const now = new Date();

  if (!productId && !categoryId) {
    res.status(400);
    throw new Error("Product ID or Category ID is required");
  }

  // Find active coupons
  let coupons = await Coupon.find({
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
  });

  // Filter coupons based on query parameters
  coupons = coupons.filter((coupon) => {
    // Include all coupons that apply to all products
    if (coupon.applicableTo === "all") {
      return true;
    }

    // Include product-specific coupons
    if (
      coupon.applicableTo === "product" &&
      productId &&
      coupon.applicableProducts.includes(productId)
    ) {
      return true;
    }

    // Include category-specific coupons
    if (
      coupon.applicableTo === "category" &&
      categoryId &&
      coupon.applicableCategories.includes(categoryId)
    ) {
      return true;
    }

    return false;
  });

  res.json(coupons);
});

// Export all controllers
export {
  createCoupon,
  getAllCoupons,
  getActiveCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
  getProductCoupons,
};
