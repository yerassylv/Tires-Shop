const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "admin"], default: "user" } // Добавляем поле роли
});

module.exports = mongoose.model("User", UserSchema);