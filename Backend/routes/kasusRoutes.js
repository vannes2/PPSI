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

// Route pengajuan kasus dengan upload file bukti
router.post('/ajukan-kasus', upload.single('bukti'), kasusController.ajukanKasus);

// Route mengambil semua kasus dari user tertentu
router.get('/kasus/riwayat/:id', kasusController.getKasusByUserId);

// ✅ Route baru: mengambil semua kasus
router.get('/kasus', kasusController.getAllKasus);

module.exports = router;
