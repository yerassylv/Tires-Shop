const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Если заказ от авторизованного пользователя
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Tire", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, required: true },
  deliveryMethod: { type: String, enum: ["pickup", "courier"], required: true },
  address: { type: String, required: false }, // Заполняется только если доставка
  status: { type: String, enum: ["pending", "processing", "completed", "canceled"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
