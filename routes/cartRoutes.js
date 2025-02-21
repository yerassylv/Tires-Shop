const express = require("express");
const { getCart, addToCart, removeFromCart } = require("../controllers/cartController");
const { authenticateSession } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateSession, getCart);
router.post("/", authenticateSession, addToCart);
router.delete("/:productId", authenticateSession, removeFromCart);

module.exports = router;