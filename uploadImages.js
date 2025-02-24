const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const Restaurant = require("./models/Restaurant");

dotenv.config(); // Загружаем переменные окружения

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.log("❌ Connection error:", err));

// Настройки Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Список файлов изображений (замени своими путями)
const images = {
    "The Gourmet Spot": "public/images/gourmet.jpg",
    "Ocean Breeze": "public/images/ocean.jpg",
    "Golden Fork": "public/images/fork.jpg",
    "Steakhouse Deluxe": "public/images/steakhouse.jpg",
    "Pasta Paradise": "public/images/pasta.jpg",
    "Sushi Time": "public/images/sushi.jpg",
    "Spicy Grill": "public/images/grill.jpg",
    "The French Corner": "public/images/french.jpg",
    "Burger Haven": "public/images/burger.jpg",
    "Vegan Delight": "public/images/vegan.jpg"
};

// Функция загрузки изображения в Cloudinary
async function uploadToCloudinary(imagePath, restaurantName) {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: "restback_restaurants",
            public_id: restaurantName.toLowerCase().replace(/ /g, "_")
        });
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Error uploading ${restaurantName} image:`, error);
        return null;
    }
}

// Функция загрузки всех изображений и обновления MongoDB
async function uploadImagesForRestaurants() {
    try {
        const restaurants = await Restaurant.find();
        for (const restaurant of restaurants) {
            if (images[restaurant.name]) {
                console.log(`📤 Uploading image for ${restaurant.name}...`);
                const imageUrl = await uploadToCloudinary(images[restaurant.name], restaurant.name);
                if (imageUrl) {
                    await Restaurant.updateOne({ _id: restaurant._id }, { image: imageUrl });
                    console.log(`✅ Image updated for ${restaurant.name}`);
                }
            } else {
                console.log(`⚠ No image found for ${restaurant.name}`);
            }
        }
        console.log("🎉 All images uploaded and updated in MongoDB!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error processing images:", error);
        mongoose.connection.close();
    }
}

// Запуск загрузки изображений
uploadImagesForRestaurants();
