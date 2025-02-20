const express = require("express");
const { getAllProducts, createProduct } = require("../controllers/productController");
const upload = require("../config/multer");

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", upload.single("image"), createProduct);

module.exports = router;