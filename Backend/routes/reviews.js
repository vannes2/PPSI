const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// === ROUTE UNTUK USER ===
router.post('/', reviewController.createUserReview); // User kirim review
router.get('/rating/:pengacaraId', reviewController.getRatingByPengacara);

// === ROUTE UNTUK ADMIN ===
router.get('/all', reviewController.getAllReviews);        // Ambil semua review
router.post('/admin-create', reviewController.adminCreateReview); // Admin buat review
router.put('/:reviewId', reviewController.updateReview);   // Admin edit review
router.delete('/:reviewId', reviewController.deleteReview); // Admin hapus review

module.exports = router;
