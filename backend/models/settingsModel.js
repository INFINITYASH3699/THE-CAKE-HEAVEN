// models/settingsModel.js
import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    general: {
      storeName: { type: String, default: "Cake Heaven" },
      storeEmail: { type: String, default: "" },
      storePhone: { type: String, default: "" },
      storeAddress: { type: String, default: "" },
      currency: { type: String, default: "INR" },
      currencySymbol: { type: String, default: "₹" },
      taxRate: { type: Number, default: 5 },
      enableReviews: { type: Boolean, default: true },
      enableWishlist: { type: Boolean, default: true },
      maintenanceMode: { type: Boolean, default: false },
      logoUrl: { type: String, default: "/logo.png" },
    },
    email: {
      smtpHost: { type: String, default: "" },
      smtpPort: { type: Number, default: 587 },
      smtpUser: { type: String, default: "" },
      smtpPassword: { type: String, default: "" },
      smtpFrom: { type: String, default: "" },
      smtpFromName: { type: String, default: "Cake Heaven" },
      enableSSL: { type: Boolean, default: true },
      enableTemplates: { type: Boolean, default: true },
    },
    payment: {
      enablePaypal: { type: Boolean, default: false },
      paypalClientId: { type: String, default: "" },
      paypalClientSecret: { type: String, default: "" },
      paypalSandboxMode: { type: Boolean, default: true },

      enableStripe: { type: Boolean, default: false },
      stripePublishableKey: { type: String, default: "" },
      stripeSecretKey: { type: String, default: "" },
      stripeTestMode: { type: Boolean, default: true },

      enableRazorpay: { type: Boolean, default: true },
      razorpayKeyId: { type: String, default: "" },
      razorpayKeySecret: { type: String, default: "" },
      razorpayTestMode: { type: Boolean, default: true },

      enableCashOnDelivery: { type: Boolean, default: true },
      codFee: { type: Number, default: 0 },

      customPaymentMethods: [
        {
          id: { type: String },
          name: { type: String },
          fee: { type: Number, default: 0 },
          isActive: { type: Boolean, default: true },
        },
      ],
    },
    shipping: {
      enableShipping: { type: Boolean, default: true },
      freeShippingThreshold: { type: Number, default: 1000 },
      shippingMethods: [
        {
          id: { type: String },
          name: { type: String },
          cost: { type: Number, default: 0 },
          minDeliveryDays: { type: Number, default: 1 },
          maxDeliveryDays: { type: Number, default: 5 },
          isActive: { type: Boolean, default: true },
        },
      ],
      enableLocalPickup: { type: Boolean, default: true },
      pickupLocations: [
        {
          id: { type: String },
          name: { type: String },
          address: { type: String },
          city: { type: String },
          state: { type: String },
          pincode: { type: String },
          contactNumber: { type: String },
          openingHours: { type: String },
          isActive: { type: Boolean, default: true },
        },
      ],
      shippingOrigin: {
        address: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" },
        country: { type: String, default: "India" },
      },
    },
    user: {
      userRegistration: { type: Boolean, default: true },
      requireEmailVerification: { type: Boolean, default: true },
      requireApproval: { type: Boolean, default: false },
      allowGuestCheckout: { type: Boolean, default: true },

      minimumPasswordLength: { type: Number, default: 8 },
      passwordRequireUppercase: { type: Boolean, default: true },
      passwordRequireNumber: { type: Boolean, default: true },
      passwordRequireSymbol: { type: Boolean, default: false },

      sessionTimeout: { type: Number, default: 60 },
      maxLoginAttempts: { type: Number, default: 5 },
      rememberMeDuration: { type: Number, default: 30 },

      storeCustomerIP: { type: Boolean, default: true },
      storeCustomerLocation: { type: Boolean, default: false },
      cookieConsentRequired: { type: Boolean, default: true },

      sendWelcomeEmail: { type: Boolean, default: true },
      sendOrderConfirmation: { type: Boolean, default: true },
      sendShippingUpdates: { type: Boolean, default: true },
      sendAbandonedCartReminder: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// There should only be one settings document
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
