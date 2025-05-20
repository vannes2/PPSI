const express = require("express");
const router = express.Router();
const konsultasiController = require("../controllers/konsultasiController");
const { getSession } = require("../models/konsultasiSessionModel");

// Endpoint untuk ambil sesi konsultasi aktif user-pengacara
router.get("/session/:userId/:pengacaraId", async (req, res) => {
  const { userId, pengacaraId } = req.params;
  try {
    const session = await getSession(userId, pengacaraId);
    if (!session) return res.status(404).json({ message: "Sesi konsultasi tidak ditemukan" });
    res.json(session);
  } catch (error) {
    console.error("Error get session:", error);
    res.status(500).json({ message: "Gagal mengambil sesi konsultasi" });
  }
});

// Tambahkan endpoint untuk riwayat konsultasi user
router.get("/riwayat/:userId", konsultasiController.getRiwayatKonsultasi);

module.exports = router;
