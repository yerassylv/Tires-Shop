const mongoose = require("mongoose");

const TireSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  size: { type: String, required: true },
  season: { 
    type: String, 
    enum: ["summer", "winter", "all-season"], 
    required: true 
  },
  loadIndex: { type: Number, required: true },
  speedIndex: { type: String, required: true },
  vehicleType: { 
    type: String, 
    enum: ["passenger", "SUV", "commercial"], 
    required: true 
  },
  studded: { type: Boolean, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  description: { type: String },
  image: { type: String, default: "public/uploads/default-tire.jpg" },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      user: String,
      text: String,
      rating: Number,
      date: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Tire", TireSchema);