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

router.post('/ajukan-kasus', upload.single('bukti'), kasusController.ajukanKasus);
router.get('/kasus/riwayat/:id', kasusController.getKasusByUserId);
router.get('/kasus', kasusController.getAllKasus);
router.put('/kasus/update-status/:id', kasusController.updateKasusStatus);
router.post('/kasus/log-aktivitas', kasusController.logAktivitas);
router.get('/kasus/log-aktivitas/:id', kasusController.getLogAktivitasByUser);
router.put('/kasus/ambil/:id', kasusController.ambilKasus); // ✅ pakai PUT dan ambil param dari :id

module.exports = router;
