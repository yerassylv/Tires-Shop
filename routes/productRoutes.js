const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const upload = require("../config/multer");
const { isAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", isAdmin, upload.single("image"), createProduct);
router.put("/:id", isAdmin, upload.single("image"), updateProduct);
router.delete("/:id", isAdmin, deleteProduct);

module.exports = router;