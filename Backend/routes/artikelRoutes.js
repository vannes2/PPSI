const express = require("express");
const router = express.Router();
const ArtikelController = require("../controllers/artikelController");
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

// ✅ POST upload artikel (gunakan controller, jangan inline)
router.post("/artikel", upload.single("file"), ArtikelController.uploadArtikel);

module.exports = router;
