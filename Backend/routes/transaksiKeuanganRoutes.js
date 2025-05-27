const express = require("express");
const router = express.Router();
const transaksiKeuanganController = require("../controllers/transaksiKeuanganController");

router.get("/total", transaksiKeuanganController.getTotalPendapatan);
router.get("/ajukan-kasus", transaksiKeuanganController.getKasusSelesai);
router.get("/konsultasi-session", transaksiKeuanganController.getKonsultasiSelesai);
router.put("/transfer/:type/:id", transaksiKeuanganController.updateTransferStatus);

module.exports = router;
