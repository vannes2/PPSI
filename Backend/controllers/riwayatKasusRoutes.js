const express = require("express");
const router = express.Router();
const kasusController = require("../controllers/kasusController");

// Endpoint: Ambil riwayat kasus berdasarkan user_id
router.get("/riwayat/:id", kasusController.getKasusByUserId);

module.exports = router;
