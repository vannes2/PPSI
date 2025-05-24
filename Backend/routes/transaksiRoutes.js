const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

// Endpoint transaksi kasus
router.get('/ajukan-kasus', transaksiController.getTransaksiKasus);

// Endpoint transaksi konsultasi
router.get('/konsultasi-session', transaksiController.getTransaksiKonsultasi);

module.exports = router;
