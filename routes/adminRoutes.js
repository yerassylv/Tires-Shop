const express = require("express");
const { isAdmin } = require("../middleware/adminMiddleware");
const { getAllUsers, changeUserRole, deleteUser } = require("../controllers/adminController");

const router = express.Router();

router.get("/users", isAdmin, getAllUsers);
router.put("/users/:id/role", isAdmin, changeUserRole);
router.delete("/users/:id", isAdmin, deleteUser);

module.exports = router;