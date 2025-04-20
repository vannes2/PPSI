const express = require('express');
const router = express.Router();
const lawyerController = require('../controllers/lawyerController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage: storage });

router.post(
    '/lawyers/register',
    upload.fields([
        { name: 'uploadKTP', maxCount: 1 },
        { name: 'uploadFoto', maxCount: 1 },
        { name: 'uploadKartuAdvokat', maxCount: 1 },
        { name: 'uploadPKPA', maxCount: 1 }
    ]),
    lawyerController.register
);

module.exports = router;
