const bcrypt = require("bcryptjs");
const User = require("../models/User");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Отправка OTP
exports.sendOtp = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Проверка пароля
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: "Password must be at least 6 characters long and contain at least one letter and one number." });
  }

  try {
    // Проверка уникальности email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "This email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`
    });

    const user = new User({
      username,
      email,
      password: hashedPassword,
      otp,
      verified: false
    });

    await user.save();

    res.status(200).json({ message: "OTP sent. Verify your account." });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// Проверка OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.verified = true;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: "Account verified! Redirecting to login..." });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

// Логин
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(400).json({ message: "Account not registered" });
      }

      if (!user.verified) {
          return res.status(400).json({ message: "User not verified" });
      }

      if (!(await bcrypt.compare(password, user.password))) {
          return res.status(400).json({ message: "Incorrect login or password" });
      }

      req.session.userId = user._id; // Сохраняем идентификатор пользователя в сессии

      res.status(200).json({ message: "Login successful" });
  } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ message: "Error logging in" });
  }
};

// Получение профиля пользователя
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("-password -otp");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// Выход из системы
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
};