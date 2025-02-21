const Order = require("../models/Order");
const Cart = require("../models/Cart");
const nodemailer = require("nodemailer");

// 📌 Настройка почтового транспорта (используем данные из .env)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 📌 Функция создания заказа (Checkout)
const createOrder = async (req, res) => {
    try {
        const { name, email, phone, deliveryMethod, address } = req.body;

        // Получаем корзину пользователя
        const cart = await Cart.findOne({ user: req.session.userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        // Формируем заказ
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

        // 📧 Отправка email с информацией о заказе
        const orderDetails = newOrder.items.map(item => 
            `<li>${item.quantity} x ${item.product.model} (${item.product.price} USD/шт)</li>`
        ).join("");

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Подтверждение заказа в TireX",
            html: `
                <h2>Спасибо за заказ, ${name}!</h2>
                <p>Ваш заказ оформлен. Вот его детали:</p>
                <ul>${orderDetails}</ul>
                <p><strong>Сумма заказа:</strong> ${newOrder.totalPrice} USD</p>
                <p><strong>Способ получения:</strong> ${deliveryMethod === "courier" ? "Курьерская доставка" : "Самовывоз"}</p>
                ${address ? `<p><strong>Адрес доставки:</strong> ${address}</p>` : ""}
                <p>Мы свяжемся с вами для подтверждения.</p>
                <p>Спасибо, что выбрали TireX!</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "Order placed successfully! Check your email for details.", order: newOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Error processing order" });
    }
};

// 📌 Функция получения всех заказов (для админов)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("items.product").sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders" });
    }
};

// 📌 Экспортируем функции
module.exports = { createOrder, getAllOrders };
