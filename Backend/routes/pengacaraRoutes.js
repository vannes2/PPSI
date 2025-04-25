const express = require("express");
const mysql = require("mysql2");
const router = express.Router();

// Koneksi ke database
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Sesuaikan dengan user database Anda
    password: "", // Sesuaikan dengan password database Anda
    database: "cerdas_hukum" // Ganti dengan nama database Anda
});

db.connect((err) => {
    if (err) {
        console.error("Koneksi database gagal:", err);
    } else {    
        console.log("Terhubung ke database MySQL");
    }
});

// Route untuk mendapatkan daftar pengacara
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

// Route untuk menghapus pengacara berdasarkan ID
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

// Route untuk memperbarui data pengacara berdasarkan ID
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
