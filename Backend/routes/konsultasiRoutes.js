const express = require("express");
const router = express.Router();
const konsultasiController = require("../controllers/konsultasiController");

// Endpoint ambil riwayat konsultasi user
router.get("/riwayat/:userId", konsultasiController.getRiwayatKonsultasi);

module.exports = router;
