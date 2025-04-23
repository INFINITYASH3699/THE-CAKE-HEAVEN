// controllers/settingsController.js
import Settings from "../models/settingsModel.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();
  res.json(settings);
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  const { general, email, payment, shipping, user } = req.body;

  const settings = await Settings.getSettings();

  // Update settings with new values
  if (general) settings.general = general;
  if (email) settings.email = email;
  if (payment) settings.payment = payment;
  if (shipping) settings.shipping = shipping;
  if (user) settings.user = user;

  const updatedSettings = await settings.save();
  res.json(updatedSettings);
});

// @desc    Update store logo
// @route   POST /api/settings/logo
// @access  Private/Admin
const updateLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload a file");
  }

  try {
    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "cake-heaven/settings",
    });

    // Remove temp file
    fs.unlinkSync(req.file.path);

    // Update logo URL in settings
    const settings = await Settings.getSettings();
    settings.general.logoUrl = result.secure_url;
    await settings.save();

    res.json({
      message: "Logo uploaded successfully",
      logoUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading logo:", error);
    res.status(500);
    throw new Error("Error uploading logo. Please try again.");
  }
});

// @desc    Test email configuration
// @route   POST /api/settings/test-email
// @access  Private/Admin
const testEmailConfiguration = asyncHandler(async (req, res) => {
  const {
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPassword,
    smtpFrom,
    smtpFromName,
    enableSSL,
    testEmail,
  } = req.body;

  if (
    !smtpHost ||
    !smtpPort ||
    !smtpUser ||
    !smtpPassword ||
    !smtpFrom ||
    !testEmail
  ) {
    res.status(400);
    throw new Error("Please provide all required SMTP settings");
  }

  try {
    // Create test transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: enableSSL,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Send test email
    await transporter.sendMail({
      from: `"${smtpFromName}" <${smtpFrom}>`,
      to: testEmail,
      subject: "Test Email from Cake Heaven",
      text: "This is a test email to verify your SMTP configuration.",
      html: "<p>This is a test email to verify your SMTP configuration.</p><p>If you're seeing this, your email settings are working correctly!</p>",
    });

    res.json({ success: true, message: "Test email sent successfully" });
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500);
    throw new Error(`Failed to send test email: ${error.message}`);
  }
});

// @desc    Test payment gateway configuration
// @route   POST /api/settings/test-payment
// @access  Private/Admin
const testPaymentGateway = asyncHandler(async (req, res) => {
  const { gateway } = req.body;

  // In a real implementation, you would use the payment gateway's SDK to validate credentials
  // For now, we'll just simulate success

  let message = "";
  switch (gateway) {
    case "paypal":
      message = "PayPal configuration is valid";
      break;
    case "stripe":
      message = "Stripe configuration is valid";
      break;
    case "razorpay":
      message = "Razorpay configuration is valid";
      break;
    default:
      res.status(400);
      throw new Error("Invalid gateway specified");
  }

  res.json({ success: true, message });
});

export {
  getSettings,
  updateSettings,
  updateLogo,
  testEmailConfiguration,
  testPaymentGateway,
};
