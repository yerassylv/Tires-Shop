const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tire = require('./models/Tire'); // Подключаем модель шин

dotenv.config(); // Загружаем переменные окружения

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB подключен'))
  .catch(err => console.log('❌ Ошибка подключения к MongoDB:', err));

// Генерация случайных шин
const generateTires = (count) => {
    const brands = ['Michelin', 'Pirelli', 'Goodyear', 'Bridgestone', 'Continental', 'Yokohama'];
    const models = ['Pilot Sport 4', 'Eagle F1', 'Blizzak WS90', 'X-Ice Snow', 'Turanza T005', 'ContiSportContact'];
    const sizes = ['225/45R17', '205/55R16', '215/60R17', '235/45R18', '245/40R19'];
    const seasons = ['summer', 'winter', 'all-season'];
    const loadIndexes = [88, 91, 95, 100];
    const speedIndexes = ['H', 'V', 'W', 'Y'];
    const vehicleTypes = ["passenger", "SUV", "commercial"];
    const descriptions = [
        "High-performance summer tire",
        "Winter tire with excellent grip on snow and ice",
        "All-season tire with balanced performance",
        "Sport tire for high-speed handling",
        "Eco-friendly tire with low rolling resistance"
    ];

    let tires = [];
    for (let i = 0; i < count; i++) {
        tires.push({
            brand: brands[Math.floor(Math.random() * brands.length)],
            model: models[Math.floor(Math.random() * models.length)],
            size: sizes[Math.floor(Math.random() * sizes.length)],
            season: seasons[Math.floor(Math.random() * seasons.length)],
            loadIndex: loadIndexes[Math.floor(Math.random() * loadIndexes.length)],
            speedIndex: speedIndexes[Math.floor(Math.random() * speedIndexes.length)],
            vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
            studded: Math.random() > 0.7,
            price: Math.floor(Math.random() * (400 - 100) + 100),
            stock: Math.floor(Math.random() * (50 - 5) + 5),
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            image: "",
            rating: 0,
            reviews: [],
            createdAt: new Date()
        });
    }
    return tires;
};

// Загрузка данных в MongoDB
const seedDatabase = async () => {
    try {
        const tires = generateTires(50); // Генерируем 50 карточек
        await Tire.insertMany(tires);
        console.log('✅ 50 шин добавлены в базу');

        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Ошибка записи в базу:", err);
        mongoose.connection.close();
    }
};

// Запускаем процесс
seedDatabase();