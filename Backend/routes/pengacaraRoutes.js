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
    const sql = "SELECT id, nama, spesialisasi, pengalaman FROM pengacara";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Gagal mengambil data pengacara:", err);
            res.status(500).json({ error: "Gagal mengambil data pengacara" });
        } else {
            res.json(results);
        }
    });
});
    
module.exports = router;
