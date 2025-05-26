const express = require("express");
const multer = require("multer");
const {
  getAllPengacara,
  uploadFotoPengacara,
} = require("../controllers/profilpengacaraController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = file.originalname.split(".").pop();
    cb(null, `profilpengacara_${timestamp}.${ext}`);
  },
});

const upload = multer({ storage });

// Endpoint ambil semua pengacara
router.get("/profilpengacara", getAllPengacara);

// Endpoint upload/update foto pengacara
router.put("/profilpengacara/upload/:id", upload.single("foto"), uploadFotoPengacara);

module.exports = router;
