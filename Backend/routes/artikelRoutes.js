const express = require("express");
const router = express.Router();
const ArtikelController = require("../controllers/artikelController");
const multer = require("multer");
const path = require("path");

// Setup penyimpanan multer: file PDF disimpan di folder uploads/pdf/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/pdf/");
  },
  filename: function (req, file, cb) {
    // Nama file unik dengan timestamp + ekstensi asli
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Middleware upload multer
const upload = multer({ storage: storage });

// Routes:
// GET semua artikel
router.get("/artikel", ArtikelController.getAllArtikel);

// GET artikel by ID
router.get("/artikel/:id", ArtikelController.getArtikelById);

// POST artikel dengan file upload (field 'file' pada form)
router.post("/artikel", upload.single("file"), ArtikelController.uploadArtikel);

module.exports = router;
