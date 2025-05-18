const express = require("express");
const router = express.Router();
const riwayatController = require("../controllers/riwayatController");

router.get("/riwayat/user/:id", riwayatController.getRiwayatUser);
router.get("/riwayat/konsultasi/:id", riwayatController.getRiwayatKonsultasi);

module.exports = router;
