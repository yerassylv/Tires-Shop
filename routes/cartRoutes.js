const express = require("express");
const { getCart, addToCart, removeFromCart } = require("../controllers/cartController");
const { authenticateSession } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/api", authenticateSession, getCart); // ✅ Теперь API доступен по /cart/api
router.post("/api", authenticateSession, addToCart);
router.delete("/api/:productId", authenticateSession, removeFromCart);

module.exports = router;
