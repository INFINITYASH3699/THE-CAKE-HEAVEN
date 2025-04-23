// routes/settingsRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  getSettings,
  updateSettings,
  updateLogo,
  testEmailConfiguration,
  testPaymentGateway,
} from "../controllers/settingsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept only images
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// All routes require admin access
router.use(protect, admin);

// Routes
router.get("/", getSettings);
router.put("/", updateSettings);
router.post("/logo", upload.single("logo"), updateLogo);
router.post("/test-email", testEmailConfiguration);
router.post("/test-payment", testPaymentGateway);

export default router;
