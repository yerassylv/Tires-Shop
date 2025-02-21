const express = require("express");
const { createOrder, getAllOrders } = require("../controllers/orderController");
const { isAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", createOrder); // Оформление заказа
router.get("/", isAdmin, getAllOrders); // Получение всех заказов (для админов)

module.exports = router;
