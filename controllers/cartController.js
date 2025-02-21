const Cart = require("../models/Cart");

// Получение корзины пользователя
exports.getCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.session.userId }).populate("items.product");
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      console.log("Cart data:", cart); // Отладочное сообщение
      res.status(200).json(cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
      res.status(500).json({ message: "Error fetching cart" });
    }
  };

// Добавление товара в корзину
exports.addToCart = async (req, res) => {
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.session.userId });

    if (!cart) {
      cart = new Cart({ user: req.session.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart" });
  }
};


exports.removeFromCart = async (req, res) => {
  try {
      const { productId } = req.params;
      const userId = req.session.userId;

      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
          return res.status(404).json({ message: "Cart not found" });
      }

      // Фильтруем товары, оставляя только те, которые не совпадают с удаляемым
      cart.items = cart.items.filter(item => item.product.toString() !== productId);

      await cart.save();
      res.json({ message: "Product removed from cart", cart });
  } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Server error" });
  }
};