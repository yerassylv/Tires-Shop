const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const products = [
  {
    name: "Michelin Pilot Sport 4",
    description: "High-performance summer tire",
    price: 200,
    imageUrl: "https://example.com/michelin-pilot-sport-4.jpg"
  },
  {
    name: "Bridgestone Blizzak WS90",
    description: "Winter tire with excellent grip on snow and ice",
    price: 180,
    imageUrl: "https://example.com/bridgestone-blizzak-ws90.jpg"
  },
  {
    name: "Goodyear Eagle F1 Asymmetric 5",
    description: "Ultra-high-performance summer tire",
    price: 220,
    imageUrl: "https://example.com/goodyear-eagle-f1.jpg"
  },
  {
    name: "Pirelli P Zero",
    description: "High-performance summer tire for sports cars",
    price: 250,
    imageUrl: "https://example.com/pirelli-p-zero.jpg"
  },
  {
    name: "Continental WinterContact TS 860",
    description: "Winter tire with excellent handling on wet and snowy roads",
    price: 190,
    imageUrl: "https://example.com/continental-wintercontact.jpg"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({});
    console.log("🗑️ Deleted existing products");

    await Product.insertMany(products);
    console.log("🌱 Seeded database with products");

    mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();