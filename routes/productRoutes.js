const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const upload = require("../config/multer");
const { authenticateToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", authenticateToken, isAdmin, upload.single("image"), createProduct);
router.put("/:id", authenticateToken, isAdmin, upload.single("image"), updateProduct);
router.delete("/:id", authenticateToken, isAdmin, deleteProduct);

module.exports = router;