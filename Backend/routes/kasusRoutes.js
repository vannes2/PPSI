const express = require('express');
const router = express.Router();
const multer = require('multer');
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

const upload = multer({ storage });

// ROUTES

// Create kasus baru (dengan upload file bukti opsional)
router.post('/kasus', upload.single('bukti'), kasusController.createKasus);

// Read semua kasus
router.get('/kasus', kasusController.getAllKasus);

// Update data kasus lengkap
router.put('/kasus/:id', upload.single('bukti'), kasusController.updateKasus);

// Update status kasus (fungsi lama)
router.put('/kasus/update-status/:id', kasusController.updateKasusStatus);

// Delete kasus
router.delete('/kasus/:id', kasusController.deleteKasus);

// Log aktivitas
router.post('/kasus/log-aktivitas', kasusController.logAktivitas);
router.get('/kasus/log-aktivitas/:id', kasusController.getLogAktivitasByUser);

// Ambil kasus oleh lawyer
router.put('/kasus/ambil/:id', kasusController.ambilKasus);

// Riwayat kasus user
router.get('/kasus/riwayat/:userId', kasusController.getRiwayatKasusByUser);

// Ajukan kasus (fungsi lama)
router.post('/ajukan-kasus', upload.single('bukti'), kasusController.ajukanKasus);

router.get("/riwayat/pengacara/:pengacaraId", kasusController.getRiwayatKasusByPengacara);

module.exports = router;
