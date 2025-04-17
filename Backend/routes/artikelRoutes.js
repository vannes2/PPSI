const express = require("express");
const router = express.Router();
const ArtikelController = require("../controllers/artikelController");
const Artikel = require("../models/Artikel");
const multer = require("multer");
const path = require("path");

// Setup penyimpanan multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ✅ GET semua artikel
router.get("/artikel", ArtikelController.getAllArtikel);

// ✅ POST upload artikel
router.post("/artikel", upload.single("file"), (req, res) => {
  try {
    const { judul } = req.body;
    const filePath = req.file ? req.file.path : null;

    if (!judul || !filePath) {
      return res.status(400).json({ error: "Judul dan file wajib diisi" });
    }

    Artikel.createArtikel(judul, filePath, (err, result) => {
      if (err) {
        console.error("Gagal simpan ke DB:", err);
        return res.status(500).json({ error: "Gagal menyimpan ke database" });
      }

      res.status(201).json({ message: "Artikel berhasil ditambahkan" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Terjadi kesalahan internal" });
  }
});

module.exports = router;
