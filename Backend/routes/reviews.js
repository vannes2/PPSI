const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Rute untuk Halaman Admin
router.get('/all', reviewController.getAllReviews);
router.post('/admin-create', reviewController.adminCreateReview);
router.put('/:reviewId', reviewController.updateReview);
router.delete('/:reviewId', reviewController.deleteReview);

// Anda bisa menambahkan rute lain untuk pengguna di sini jika perlu

module.exports = router;