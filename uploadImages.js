const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const Tire = require('./models/Tire');
const fs = require('fs');
const path = require('path');

dotenv.config(); 

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB подключен'))
  .catch(err => console.log('❌ Ошибка подключения к MongoDB:', err));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Бренды и соответствующие файлы изображений
const brands = ['Michelin', 'Pirelli', 'Goodyear', 'Bridgestone', 'Continental', 'Yokohama'];
const imagePathMap = {}; // Здесь будут храниться URL загруженных картинок

// Функция загрузки изображения в Cloudinary
async function uploadToCloudinary(imagePath, brand) {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: "tirex_tires",
            public_id: `tirex_${brand.toLowerCase()}`
        });
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Ошибка загрузки ${brand} в Cloudinary:`, error);
        return null;
    }
}

// Функция загрузки всех изображений из папки и обновления MongoDB
async function uploadImagesForBrands(folderPath) {
    try {
        for (const brand of brands) {
            const imagePath = path.join(folderPath, `${brand}.jpg`); // Файл должен называться по имени бренда

            if (!fs.existsSync(imagePath)) {
                console.log(`⚠ Изображение для бренда ${brand} не найдено (${imagePath})`);
                continue;
            }

            console.log(`📤 Загружаем изображение для ${brand}...`);
            const imageUrl = await uploadToCloudinary(imagePath, brand);
            
            if (imageUrl) {
                imagePathMap[brand] = imageUrl; // Сохраняем URL в объект
                console.log(`✅ Изображение для ${brand} загружено: ${imageUrl}`);

                // Обновляем ВСЕ шины этого бренда в MongoDB
                const result = await Tire.updateMany(
                    { brand: brand, image: "" }, // Обновляем только шины без картинки
                    { image: imageUrl }
                );

                console.log(`🔄 Обновлено шин ${brand}: ${result.modifiedCount}`);
            }
        }

        console.log("🎉 Все изображения загружены и обновлены в MongoDB!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Ошибка обработки:", error);
        mongoose.connection.close();
    }
}

// Запуск загрузки изображений
const folderPath = path.join(__dirname, 'public/images/tires');
uploadImagesForBrands(folderPath);
