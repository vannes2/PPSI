const express = require("express");
const router = express.Router();

const konsultasiController = require("../controllers/konsultasiController");

// Route yang memanggil controller getRiwayatKonsultasi
router.get("/riwayat/:userId", konsultasiController.getRiwayatKonsultasi);

module.exports = router;

