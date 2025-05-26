const express = require("express");
const router = express.Router();
const riwayatPengacaraController = require("../controllers/riwayatPengacaraController");

// Riwayat Kasus untuk pengacara berdasarkan id pengacara
router.get("/kasus/riwayat/pengacara/:pengacaraId", riwayatPengacaraController.getRiwayatKasusByPengacara);

// Riwayat Konsultasi untuk pengacara berdasarkan id pengacara
router.get("/konsultasi_session/riwayat/pengacara/:pengacaraId", riwayatPengacaraController.getRiwayatKonsultasiByPengacara);

module.exports = router;
