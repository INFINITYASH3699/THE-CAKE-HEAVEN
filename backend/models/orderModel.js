import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  customizations: {
    messageOnCake: { type: String },
    specialInstructions: { type: String },
  },
});

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
      mobileNumber: { type: String, required: true },
    },
    orderDetails: {
      orderFor: { type: String, required: true },
      birthDate: { type: String },
      specialInstructions: { type: String },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: [
        "credit_card",
        "debit_card",
        "paypal",
        "wallet",
        "cash_on_delivery",
      ],
    },
    deliveryOption: {
      type: String,
      required: true,
      enum: ["standard", "express", "same-day"],
      default: "standard",
    },
    walletAmountUsed: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    discountAmount: {
      type: Number,
      default: 0.0,
    },
    couponCode: {
      type: String,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "processing",
        "confirmed",
        "preparing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "processing",
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    cancelReason: {
      type: String,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "processing",
            "confirmed",
            "preparing",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled",
            "refunded",
          ],
        },
        date: {
          type: Date,
          default: Date.now,
        },
        comment: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate order number
orderSchema.pre("save", async function (next) {
  try {
    if (this.isNew && !this.orderNumber) {
      // Generate a unique order number with format CAKE-YYYYMMDD-XXXXX
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}${month}${day}`;

      // Combine timestamp and random number for guaranteed uniqueness
      const timestamp = Date.now().toString().slice(-5);
      const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
      
      this.orderNumber = `CAKE-${dateString}-${timestamp}${randomPart}`;
      console.log("Generated order number in pre-save hook:", this.orderNumber);

      // Add initial status to status history if not already added
      if (!this.statusHistory || this.statusHistory.length === 0) {
        this.statusHistory = [
          {
            status: this.status || 'processing',
            date: new Date(),
            comment: "Order placed",
          },
        ];
      }
    } else if (this.isModified("status")) {
      // Add to status history when status changes
      this.statusHistory.push({
        status: this.status,
        date: new Date(),
        comment: "",
      });
    }
    next();
  } catch (error) {
    console.error("Error in order pre-save hook:", error);
    next(error);
  }
});

// Create indexes for common queries
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ "paymentResult.id": 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;