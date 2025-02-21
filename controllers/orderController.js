const Order = require("../models/Order");
const Cart = require("../models/Cart");

// 📌 Создание заказа (Checkout)
exports.createOrder = async (req, res) => {
  try {
    const { name, email, phone, deliveryMethod, address } = req.body;

    // Получаем корзину пользователя
    const cart = await Cart.findOne({ user: req.session.userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Создаем заказ
    const newOrder = new Order({
      user: req.session.userId || null,
      name,
      email,
      phone,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalPrice: cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
      deliveryMethod,
      address: deliveryMethod === "courier" ? address : null,
      status: "pending"
    });

    await newOrder.save();

    // Очищаем корзину после оформления заказа
    await Cart.findOneAndDelete({ user: req.session.userId });

    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error processing order" });
  }
};

// 📌 Получение списка заказов (для админов)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product").sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};
