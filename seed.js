const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Restaurant = require("./models/Restaurant");

dotenv.config(); // Загружаем переменные окружения

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Connection error:", err));

// Данные для заполнения (без изображений)
const sampleRestaurants = [
    { name: "The Gourmet Spot", cuisine: "Italian", address: "123 Main St, New York", phone: "+1 212-555-1234", website: "http://gourmetspot.com", image: "", rating: 0 },
    { name: "Ocean Breeze", cuisine: "Japanese", address: "456 Elm St, Los Angeles", phone: "+1 310-555-5678", website: "http://oceanbreeze.com", image: "", rating: 0 },
    { name: "Golden Fork", cuisine: "French", address: "789 Maple Ave, Chicago", phone: "+1 312-555-2468", website: "http://goldenfork.com", image: "", rating: 0 },
    { name: "Steakhouse Deluxe", cuisine: "American", address: "101 Oak Rd, Miami", phone: "+1 305-555-7890", website: "http://steakhousedeluxe.com", image: "", rating: 0 },
    { name: "Pasta Paradise", cuisine: "Italian", address: "202 Pine Ln, Houston", phone: "+1 713-555-3456", website: "http://pastaparadise.com", image: "", rating: 0 },
    { name: "Sushi Time", cuisine: "Japanese", address: "303 Cedar St, Seattle", phone: "+1 206-555-9876", website: "http://sushitime.com", image: "", rating: 0 },
    { name: "Spicy Grill", cuisine: "Mexican", address: "404 Birch Blvd, San Francisco", phone: "+1 415-555-6543", website: "http://spicygrill.com", image: "", rating: 0 },
    { name: "The French Corner", cuisine: "French", address: "505 Walnut St, Denver", phone: "+1 303-555-1239", website: "http://frenchcorner.com", image: "", rating: 0 },
    { name: "Burger Haven", cuisine: "American", address: "606 Cherry Rd, Boston", phone: "+1 617-555-7865", website: "http://burgerhaven.com", image: "", rating: 0 },
    { name: "Vegan Delight", cuisine: "Vegan", address: "707 Spruce Ave, Austin", phone: "+1 512-555-4321", website: "http://vegandelight.com", image: "", rating: 0 }
];

// Функция заполнения базы данных
const seedDatabase = async () => {
    try {
        await Restaurant.deleteMany(); // Очистка базы перед заполнением
        await Restaurant.insertMany(sampleRestaurants);
        console.log("✅ Restaurants added successfully!");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error inserting data:", err);
        mongoose.connection.close();
    }
};

// Запускаем процесс
seedDatabase();
