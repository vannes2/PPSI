const express = require("express");
const router = express.Router();
const transaksiKeuanganController = require("../controllers/transaksiKeuanganController");

router.get("/total", transaksiKeuanganController.getTotalPendapatan);

module.exports = router;
