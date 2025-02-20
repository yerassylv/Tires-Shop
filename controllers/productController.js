const Tire = require("../models/Tire");

// Получение всех продуктов
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Tire.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Создание нового продукта
exports.createProduct = async (req, res) => {
  const { brand, model, size, season, loadIndex, speedIndex, vehicleType, studded, price, stock, description, rating, reviews } = req.body;
  const image = req.file ? req.file.path : "public/uploads/default-tire.jpg";

  try {
    const newTire = new Tire({
      brand,
      model,
      size,
      season,
      loadIndex,
      speedIndex,
      vehicleType,
      studded,
      price,
      stock,
      description,
      image,
      rating,
      reviews
    });

    await newTire.save();
    res.status(201).json(newTire);
  } catch (err) {
    res.status(500).json({ message: "Error creating product" });
  }
};