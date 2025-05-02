const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route untuk mendapatkan profil berdasarkan ID
router.get("/profile/id/:id", userController.getProfileById);

// Route untuk mendapatkan profil berdasarkan Email
router.get("/profile/email/:email", userController.getProfileByEmail);

// Route untuk memperbarui profil pengguna TANPA authMiddleware
router.put("/profile/update/:id", userController.updateUserProfile);

module.exports = router;
