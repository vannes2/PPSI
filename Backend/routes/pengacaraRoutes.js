const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "cerdas_hukum",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// GET: Semua pengacara (singkat)
router.get("/pengacara", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nama, spesialisasi, pengalaman, email, pendidikan, tanggal_daftar,
             nomor_induk_advokat, upload_foto, no_hp
      FROM pengacara
    `);
    res.json(rows);
  } catch (err) {
    console.error("Gagal mengambil data pengacara:", err);
    res.status(500).json({ error: "Gagal mengambil data pengacara" });
  }
});

// GET: Detail pengacara lengkap by ID
router.get("/pengacara/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT 
        id, nama, ktp, tanggal_lahir, jenis_kelamin, alamat,
        email, no_hp, nomor_induk_advokat, universitas, pendidikan,
        spesialisasi, pengalaman, upload_foto, harga_konsultasi,
        linkedin, instagram, twitter, resume_cv, portofolio,
        tanggal_daftar
      FROM pengacara
      WHERE id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Pengacara tidak ditemukan" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Gagal mengambil pengacara:", err);
    res.status(500).json({ error: "Gagal mengambil data pengacara" });
  }
});

// PUT: Update data pengacara by ID
router.put("/pengacara/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nama,
    ktp,
    tanggal_lahir,
    jenis_kelamin,
    alamat,
    email,
    no_hp,
    nomor_induk_advokat,
    universitas,
    pendidikan,
    spesialisasi,
    pengalaman,
    harga_konsultasi,
    linkedin,
    instagram,
    twitter,
    resume_cv,
    portofolio
  } = req.body;

  try {
    const [result] = await pool.query(`
      UPDATE pengacara SET
        nama = ?, ktp = ?, tanggal_lahir = ?, jenis_kelamin = ?, alamat = ?,
        email = ?, no_hp = ?, nomor_induk_advokat = ?, universitas = ?, pendidikan = ?,
        spesialisasi = ?, pengalaman = ?, harga_konsultasi = ?, linkedin = ?, instagram = ?,
        twitter = ?, resume_cv = ?, portofolio = ?
      WHERE id = ?
    `, [
      nama, ktp, tanggal_lahir, jenis_kelamin, alamat,
      email, no_hp, nomor_induk_advokat, universitas, pendidikan,
      spesialisasi, pengalaman, harga_konsultasi, linkedin, instagram,
      twitter, resume_cv, portofolio, id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pengacara tidak ditemukan" });
    }
    res.json({ message: "Pengacara berhasil diperbarui" });
  } catch (err) {
    console.error("Gagal memperbarui pengacara:", err);
    res.status(500).json({ error: "Gagal memperbarui pengacara" });
  }
});

// DELETE: Hapus pengacara by ID
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

module.exports = router;
