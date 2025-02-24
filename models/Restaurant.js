const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  image: { type: String, default: "" },  
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
