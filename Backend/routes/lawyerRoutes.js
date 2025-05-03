const express = require('express');
const router = express.Router();
const lawyerController = require('../controllers/lawyerController');
const multer = require('multer');
const path = require('path');

// Setup storage multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage: storage });

// ✅ Register lawyer dengan multiple fields upload
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

// ✅ List pendaftar
router.get('/lawyers/registrations', lawyerController.getRegistrations);

// ✅ Approve lawyer
router.post('/lawyers/approve/:id', lawyerController.approveLawyer);

// ✅ Tolak pendaftaran
router.delete("/lawyers/reject/:id", lawyerController.rejectLawyer);

// ✅ Ambil profil pengacara
router.get('/lawyer/profile/:id', lawyerController.getLawyerProfile);

// ✅ Update profil dengan upload foto
router.put(
    '/lawyer/profile/update/:id',
    upload.single('upload_foto'),
    lawyerController.updateLawyerProfile
);

// ✅ Get semua pengacara
router.get('/pengacara', lawyerController.getAllLawyers);

module.exports = router;
