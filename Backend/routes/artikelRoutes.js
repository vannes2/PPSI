const express = require("express");
const router = express.Router();
const ArtikelController = require("../controllers/artikelController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/artikel", ArtikelController.getAllArtikel);
router.get("/artikel/:id", ArtikelController.getArtikelById);
router.post("/artikel", upload.single("file"), ArtikelController.uploadArtikel);
router.put("/artikel/:id", upload.single("file"), ArtikelController.updateArtikel);
router.delete("/artikel/:id", ArtikelController.deleteArtikel);

module.exports = router;
