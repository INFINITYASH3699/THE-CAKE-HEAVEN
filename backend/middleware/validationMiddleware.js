import { body, param, validationResult } from "express-validator";

// Middleware to handle validation results
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User validation rules
const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
    .withMessage(
      "Password must contain a number, uppercase and lowercase letter"
    ),

  validateRequest,
];

const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),

  validateRequest,
];

// Product validation rules
const productValidation = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  body("category").notEmpty().withMessage("Category is required"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive number"),

  body("weight").notEmpty().withMessage("Weight is required"),

  body("flavor").notEmpty().withMessage("Flavor is required"),

  body("shape").notEmpty().withMessage("Shape is required"),

  body("occasion").notEmpty().withMessage("Occasion is required"),

  body("eggOrEggless")
    .notEmpty()
    .withMessage("Egg or Eggless option is required")
    .isIn(["Egg", "Eggless"])
    .withMessage("Must be either Egg or Eggless"),

  validateRequest,
];

// Order validation rules
const orderValidation = [
  body("orderItems")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least 1 item"),

  body("orderItems.*.product").notEmpty().withMessage("Product ID is required"),

  body("orderItems.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required"),

  body("shippingAddress.fullName")
    .notEmpty()
    .withMessage("Full name is required"),

  body("shippingAddress.address").notEmpty().withMessage("Address is required"),

  body("shippingAddress.city").notEmpty().withMessage("City is required"),

  body("shippingAddress.state").notEmpty().withMessage("State is required"),

  body("shippingAddress.zip").notEmpty().withMessage("Zip code is required"),

  body("shippingAddress.country").notEmpty().withMessage("Country is required"),

  body("shippingAddress.mobileNumber")
    .notEmpty()
    .withMessage("Mobile number is required"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["credit_card", "debit_card", "paypal", "wallet", "cash_on_delivery"])
    .withMessage("Invalid payment method"),

  validateRequest,
];

// Payment validation rules
const paymentValidation = [
  body("orderId").notEmpty().withMessage("Order ID is required"),

  body("paymentMethodId")
    .notEmpty()
    .withMessage("Payment method ID is required"),

  validateRequest,
];

// ID validation for routes with :id parameter
const idValidation = [
  param("id").isMongoId().withMessage("Invalid ID format"),

  validateRequest,
];

// Address validation for adding and updating addresses
const addressValidation = [
  body("fullName").notEmpty().withMessage("Full name is required"),

  body("mobileNumber").notEmpty().withMessage("Mobile number is required"),

  body("address").notEmpty().withMessage("Address is required"),

  body("city").notEmpty().withMessage("City is required"),

  body("state").notEmpty().withMessage("State is required"),

  body("zip").notEmpty().withMessage("Zip code is required"),

  body("country").notEmpty().withMessage("Country is required"),

  validateRequest,
];

// Coupon validation
const couponValidation = [
  body("code")
    .notEmpty()
    .withMessage("Coupon code is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Coupon code must be between 3 and 20 characters")
    .isAlphanumeric()
    .withMessage("Coupon code must contain only letters and numbers"),

  body("description").notEmpty().withMessage("Description is required"),

  body("discountType")
    .notEmpty()
    .withMessage("Discount type is required")
    .isIn(["percentage", "fixed"])
    .withMessage("Discount type must be either percentage or fixed"),

  body("discountAmount")
    .notEmpty()
    .withMessage("Discount amount is required")
    .isNumeric()
    .withMessage("Discount amount must be a number")
    .custom((value, { req }) => {
      if (
        req.body.discountType === "percentage" &&
        (value <= 0 || value > 100)
      ) {
        throw new Error("Percentage discount must be between 1 and 100");
      } else if (req.body.discountType === "fixed" && value <= 0) {
        throw new Error("Fixed discount must be greater than 0");
      }
      return true;
    }),

  body("validFrom")
    .notEmpty()
    .withMessage("Valid from date is required")
    .isISO8601()
    .withMessage("Valid from must be a valid date"),

  body("validUntil")
    .notEmpty()
    .withMessage("Valid until date is required")
    .isISO8601()
    .withMessage("Valid until must be a valid date")
    .custom((value, { req }) => {
      const validFrom = new Date(req.body.validFrom);
      const validUntil = new Date(value);
      if (validUntil <= validFrom) {
        throw new Error("Valid until date must be after valid from date");
      }
      return true;
    }),

  validateRequest,
];

export {
  validateRequest,
  registerValidation,
  loginValidation,
  productValidation,
  orderValidation,
  paymentValidation,
  idValidation,
  addressValidation,
  couponValidation,
};
