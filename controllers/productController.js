const Tire = require("../models/Tire");

// Получение всех продуктов с фильтрацией и пагинацией
exports.getAllProducts = async (req, res) => {
  const { brand, width, profile, diameter, season, price_min, price_max, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  let filter = {};

  if (brand) filter.brand = { $in: brand.split(",") }; // Фильтр по бренду
  if (width) filter.size = new RegExp(`^${width}/`); // Фильтр по ширине
  if (profile) filter.size = new RegExp(`/${profile}R`); // Фильтр по профилю
  if (diameter) filter.size = new RegExp(`R${diameter}$`); // Фильтр по диаметру
  if (season) filter.season = season; // Фильтр по сезонности
  if (price_min || price_max) {
    filter.price = {};
    if (price_min) filter.price.$gte = parseInt(price_min);
    if (price_max) filter.price.$lte = parseInt(price_max);
  }

  try {
    console.log("Fetching products from database with filters:", filter);
    const products = await Tire.find(filter).skip(skip).limit(parseInt(limit));
    const total = await Tire.countDocuments(filter);

    res.status(200).json({ 
      products, 
      total, 
      page, 
      pages: Math.ceil(total / limit) 
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Создание нового продукта
exports.createProduct = async (req, res) => {
  const { brand, model, size, season, loadIndex, speedIndex, vehicleType, studded, price, stock, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "public/uploads/default-tire.jpg";

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
      image
    });

    await newTire.save();
    res.status(201).json(newTire);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Error creating product" });
  }
};

// Обновление продукта
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { brand, model, size, season, loadIndex, speedIndex, vehicleType, studded, price, stock, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const updatedProduct = await Tire.findByIdAndUpdate(
      id,
      { brand, model, size, season, loadIndex, speedIndex, vehicleType, studded, price, stock, description, ...(image && { image }) },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Error updating product" });
  }
};

// Удаление продукта
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Tire.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
};
