const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware"); // Jika ada autentikasi

// Route untuk mendapatkan profil berdasarkan ID
router.get("/profile/id/:id", userController.getProfileById);

// Route untuk mendapatkan profil berdasarkan Email
router.get("/profile/email/:email", userController.getProfileByEmail);

// Route untuk memperbarui profil pengguna
router.put("/profile/update/:id", authMiddleware, userController.updateUserProfile);

module.exports = router;