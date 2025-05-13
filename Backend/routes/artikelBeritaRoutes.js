const express = require('express');
const router = express.Router();
const multer = require('multer');
const artikelController = require('../controllers/artikelBeritaController');

// Konfigurasi penyimpanan file untuk gambar artikel
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ==== ROUTE TAMBAHAN: Top Berita untuk Slideshow ====
// Harus ditempatkan di atas route dinamis seperti `/:id`
router.get('/top', artikelController.getTopBerita);
router.put('/top/:id', artikelController.updateTopStatus);

// ==== ROUTE UTAMA: CRUD Artikel ====
router.get('/', artikelController.getAllArtikel);
router.get('/:id', artikelController.getArtikelById);
router.post('/', upload.single('gambar'), artikelController.createArtikel);
router.put('/:id', upload.single('gambar'), artikelController.updateArtikel);
router.delete('/:id', artikelController.deleteArtikel);

module.exports = router;
