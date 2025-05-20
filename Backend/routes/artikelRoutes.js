const express = require("express");
const router = express.Router();
const ArtikelController = require("../controllers/artikelController");
const multer = require("multer");
const path = require("path");

// Setup penyimpanan multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/pdf/");
  },
  filename: function (req, file, cb) {
    // Gunakan timestamp agar nama file unik, dan aman
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Inisialisasi middleware upload
const upload = multer({ storage: storage });

// ======================= ROUTES ======================= //

// ✅ GET semua artikel
router.get("/artikel", ArtikelController.getAllArtikel);

// ✅ GET artikel berdasarkan ID
router.get("/artikel/:id", ArtikelController.getArtikelById);

// ✅ POST artikel dengan file upload
router.post("/artikel", upload.single("file"), ArtikelController.uploadArtikel);

module.exports = router;
