const express = require("express");
const router = express.Router();

const konsultasiController = require("../controllers/konsultasiController");

// Route yang memanggil controller getRiwayatKonsultasi
router.get("/riwayat/:userId", konsultasiController.getRiwayatKonsultasiByUser);

// Endpoint untuk riwayat konsultasi pengacara
router.get("/riwayat/pengacara/:pengacaraId", konsultasiController.getRiwayatKonsultasiByPengacara);

router.get("/", konsultasiController.getAllKonsultasi);

module.exports = router;

