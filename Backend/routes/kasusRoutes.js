const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const kasusController = require('../controllers/kasusController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// ✅ Route pengajuan kasus
router.post('/ajukan-kasus', upload.single('bukti'), kasusController.ajukanKasus);

// ✅ Route ambil kasus user
router.get('/kasus/riwayat/:id', kasusController.getKasusByUserId);

// ✅ Route ambil semua kasus (untuk lawyer)
router.get('/kasus', kasusController.getAllKasus);

// ✅ Update status kasus
router.put('/kasus/update-status/:id', kasusController.updateKasusStatus);

// ✅ Tambah log aktivitas manual (opsional)
router.post('/kasus/log-aktivitas', kasusController.logAktivitas);

// ✅ Ambil log aktivitas user
router.get('/kasus/log-aktivitas/:id', kasusController.getLogAktivitasByUser);

module.exports = router;
