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

async function uploadToCloudinary(imagePath) {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: "tirex_tires"
        });
        return result.secure_url;
    } catch (error) {
        console.error("❌ Ошибка загрузки в Cloudinary:", error);
        return null;
    }
}

async function uploadImagesFromFolder(folderPath) {
    try {
        const files = fs.readdirSync(folderPath).filter(file => /\.(jpg|jpeg|png)$/i.test(file));

        if (files.length === 0) {
            console.log("⚠ Нет изображений в папке:", folderPath);
            return;
        }

        for (const file of files) {
            const imagePath = path.join(folderPath, file);
            console.log(`📤 Загружаем: ${file}...`);

            const imageUrl = await uploadToCloudinary(imagePath);
            if (imageUrl) {
                console.log(`✅ Загружено: ${imageUrl}`);

                const tire = await Tire.findOneAndUpdate(
                    { $or: [{ image: { $exists: false } }, { image: "" }] }, // Теперь ищем и пустые
                    { image: imageUrl },
                    { new: true }
                );

                if (tire) {
                    console.log(`🔄 Обновлено: ${tire.brand} ${tire.model}`);
                } else {
                    console.log("⚠ Все шины уже имеют изображения.");
                    break;
                }
            }
        }

        console.log("🎉 Все изображения загружены и обновлены в MongoDB!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Ошибка обработки папки:", error);
        mongoose.connection.close();
    }
}

const folderPath = path.join(__dirname, 'public/images/tires');
uploadImagesFromFolder(folderPath);
