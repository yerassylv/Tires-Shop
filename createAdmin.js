const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");

    const email = "230122@astanait.edu.kz"; // Замените на нужный email
    const password = "123456a"; // Замените на нужный пароль

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ Admin account already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      username: "admin",
      email,
      password: hashedPassword,
      verified: true,
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin account created successfully");

    mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error creating admin account:", error);
    process.exit(1);
  }
};

createAdmin();