const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tire = require("./models/Tire"); // Исправлено на Tire

dotenv.config();

const products = [
  {
    brand: "Michelin",
    model: "Pilot Sport 4",
    size: "225/45R17",
    season: "summer",
    loadIndex: 91,
    speedIndex: "Y",
    vehicleType: "passenger",
    studded: false,
    price: 200,
    stock: 10,
    description: "High-performance summer tire",
    image: "https://example.com/michelin-pilot-sport-4.jpg"
  },
  {
    brand: "Bridgestone",
    model: "Blizzak WS90",
    size: "205/55R16",
    season: "winter",
    loadIndex: 91,
    speedIndex: "H",
    vehicleType: "passenger",
    studded: false,
    price: 180,
    stock: 15,
    description: "Winter tire with excellent grip on snow and ice",
    image: "https://example.com/bridgestone-blizzak-ws90.jpg"
  },
  {
    brand: "Goodyear",
    model: "Eagle F1 Asymmetric 5",
    size: "245/40R18",
    season: "summer",
    loadIndex: 97,
    speedIndex: "Y",
    vehicleType: "passenger",
    studded: false,
    price: 220,
    stock: 8,
    description: "Ultra-high-performance summer tire",
    image: "https://example.com/goodyear-eagle-f1.jpg"
  },
  {
    brand: "Pirelli",
    model: "P Zero",
    size: "235/35R19",
    season: "summer",
    loadIndex: 91,
    speedIndex: "Y",
    vehicleType: "passenger",
    studded: false,
    price: 250,
    stock: 12,
    description: "High-performance summer tire for sports cars",
    image: "https://example.com/pirelli-p-zero.jpg"
  },
  {
    brand: "Continental",
    model: "WinterContact TS 860",
    size: "195/65R15",
    season: "winter",
    loadIndex: 91,
    speedIndex: "T",
    vehicleType: "passenger",
    studded: false,
    price: 190,
    stock: 20,
    description: "Winter tire with excellent handling on wet and snowy roads",
    image: "https://example.com/continental-wintercontact.jpg"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");

    await Tire.deleteMany({});
    console.log("🗑️ Deleted existing products");

    await Tire.insertMany(products);
    console.log("🌱 Seeded database with products");

    mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();