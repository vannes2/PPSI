const express = require("express");
const mysql = require("mysql2/promise"); // pakai mysql2/promise
const router = express.Router();

// Buat koneksi pool supaya efisien dan async/await bisa dipakai
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "cerdas_hukum",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// GET: Daftar semua pengacara
router.get("/pengacara", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, nama, spesialisasi, pengalaman, email, pendidikan, tanggal_daftar FROM pengacara");
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil data pengacara:", err);
    res.status(500).json({ error: "Gagal mengambil data pengacara" });
  }
});

// GET: Detail pengacara by ID (tambahkan harga_konsultasi)
router.get("/pengacara/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT id, nama, spesialisasi, pengalaman, email, pendidikan, harga_konsultasi FROM pengacara WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Pengacara tidak ditemukan" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Gagal mengambil pengacara:", err);
    res.status(500).json({ error: "Gagal mengambil data pengacara" });
  }
});

// DELETE: Hapus pengacara
router.delete("/pengacara/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM pengacara WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pengacara tidak ditemukan" });
    }
    res.json({ message: "Pengacara berhasil dihapus" });
  } catch (err) {
    console.error("Gagal menghapus pengacara:", err);
    res.status(500).json({ error: "Gagal menghapus pengacara" });
  }
});

// PUT: Update pengacara
router.put("/pengacara/:id", async (req, res) => {
  const { id } = req.params;
  const { nama, email, spesialisasi, pengalaman, pendidikan } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE pengacara SET nama = ?, email = ?, spesialisasi = ?, pengalaman = ?, pendidikan = ? WHERE id = ?",
      [nama, email, spesialisasi, pengalaman, pendidikan, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pengacara tidak ditemukan" });
    }
    res.json({ message: "Pengacara berhasil diperbarui" });
  } catch (err) {
    console.error("Gagal memperbarui pengacara:", err);
    res.status(500).json({ error: "Gagal memperbarui pengacara" });
  }
});

module.exports = router;
