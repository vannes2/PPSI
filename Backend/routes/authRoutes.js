const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Route untuk signup (pendaftaran)
router.post("/signup", authController.signup);

// Route untuk login (tambahan)
router.post("/login", authController.login); // Memanggil login dari authController

// Route untuk mendapatkan daftar semua user
router.get("/users", authController.getUsers);

module.exports = router;
