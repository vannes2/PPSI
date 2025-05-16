const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM log_pertanyaan_user ORDER BY waktu DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil log:", err);
    res.status(500).json({ message: "Gagal mengambil data log." });
  }
});

module.exports = router;
