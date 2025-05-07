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

module.exports = router;
