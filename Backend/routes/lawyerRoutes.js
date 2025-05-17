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

// POST Register lawyer dengan multiple file upload termasuk resumeCV dan portofolio
router.post(
  '/lawyers/register',
  upload.fields([
    { name: 'uploadKTP', maxCount: 1 },
    { name: 'uploadFoto', maxCount: 1 },
    { name: 'uploadKartuAdvokat', maxCount: 1 },
    { name: 'uploadPKPA', maxCount: 1 },
    { name: 'resumeCV', maxCount: 1 },
    { name: 'portofolio', maxCount: 1 }
  ]),
  lawyerController.register
);

// GET daftar semua pendaftar pengacara
router.get('/lawyers/registrations', lawyerController.getRegistrations);

// POST approve pendaftar pengacara berdasarkan id
router.post('/lawyers/approve/:id', lawyerController.approveLawyer);

// DELETE tolak pendaftar pengacara berdasarkan id
router.delete('/lawyers/reject/:id', lawyerController.rejectLawyer);

// GET profil pengacara berdasarkan id
router.get('/lawyer/profile/:id', lawyerController.getLawyerProfile);

// PUT update profil pengacara termasuk upload file foto, resumeCV, dan portofolio
router.put(
  '/lawyer/profile/update/:id',
  upload.fields([
    { name: 'upload_foto', maxCount: 1 },
    { name: 'resumeCV', maxCount: 1 },
    { name: 'portofolio', maxCount: 1 }
  ]),
  lawyerController.updateLawyerProfile
);

// GET semua pengacara yang sudah disetujui
router.get('/pengacara', lawyerController.getAllLawyers);

module.exports = router;
