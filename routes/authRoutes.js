const express = require("express");
const { sendOtp, verifyOtp, loginUser, getProfile } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, getProfile);

module.exports = router;