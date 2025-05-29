const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardPengacaraController');

router.get('/dashboard-pengacara/:id', dashboardController.getDashboardSummary);
router.get('/dashboard-pengacara/:id/grafik', dashboardController.getPendapatanBulanan);
// --- Rute Baru ---
router.get('/dashboard-pengacara/:id/monthly-counts', dashboardController.getMonthlyCaseConsultationCounts);
// -----------------
router.get('/dashboard-pengacara/:id/transaksi', dashboardController.getDetailTransaksi);
router.get('/dashboard-pengacara/:id/notifikasi', dashboardController.getNotifikasiTransfer);

module.exports = router;