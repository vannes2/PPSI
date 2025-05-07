const express = require("express");
const mysql = require("mysql2");
const router = express.Router();

// Koneksi ke database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cerdas_hukum"
});

db.connect((err) => {
    if (err) {
        console.error("Koneksi database gagal:", err);
    } else {    
        console.log("Terhubung ke database MySQL");
    }
});

// GET: Daftar semua pengacara
router.get("/pengacara", (req, res) => {
    const sql = "SELECT id, nama, spesialisasi, pengalaman, email, pendidikan, tanggal_daftar FROM pengacara";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Gagal mengambil data pengacara:", err);
            res.status(500).json({ error: "Gagal mengambil data pengacara" });
        } else {
            res.json(results);
        }
    });
});

// ✅ GET: Detail pengacara by ID (tambahkan harga_konsultasi)
router.get("/pengacara/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT id, nama, spesialisasi, pengalaman, email, pendidikan, harga_konsultasi FROM pengacara WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Gagal mengambil pengacara:", err);
            return res.status(500).json({ error: "Gagal mengambil data pengacara" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Pengacara tidak ditemukan" });
        }
        res.json(results[0]);
    });
});

// DELETE: Hapus pengacara
router.delete("/pengacara/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM pengacara WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Gagal menghapus pengacara:", err);
            res.status(500).json({ error: "Gagal menghapus pengacara" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Pengacara tidak ditemukan" });
        } else {
            res.json({ message: "Pengacara berhasil dihapus" });
        }
    });
});

// PUT: Update pengacara
router.put("/pengacara/:id", (req, res) => {
    const { id } = req.params;
    const { nama, email, spesialisasi, pengalaman, pendidikan } = req.body;
    const sql = "UPDATE pengacara SET nama = ?, email = ?, spesialisasi = ?, pengalaman = ?, pendidikan = ? WHERE id = ?";
    
    db.query(sql, [nama, email, spesialisasi, pengalaman, pendidikan, id], (err, result) => {
        if (err) {
            console.error("Gagal memperbarui pengacara:", err);
            res.status(500).json({ error: "Gagal memperbarui pengacara" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Pengacara tidak ditemukan" });
        } else {
            res.json({ message: "Pengacara berhasil diperbarui" });
        }
    });
});

module.exports = router;
