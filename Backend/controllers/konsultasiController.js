const db = require("../config/database");

// Fungsi ini sesuai dengan route /riwayat/:userId
exports.getRiwayatKonsultasiByUser = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT ks.*, 
           p.id AS id_pengacara, 
           p.nama AS nama_pengacara,
           p.upload_foto AS foto_pengacara,
           p.harga_konsultasi
    FROM konsultasi_session ks
    LEFT JOIN pengacara p ON ks.pengacara_id = p.id
    WHERE ks.user_id = ?
    ORDER BY ks.start_time DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching riwayat konsultasi:", err);
      return res.status(500).json({ message: "Gagal mengambil data riwayat konsultasi" });
    }
    res.json(results);
  });
};

// controllers/konsultasiController.js
const konsultasiSessionModel = require("../models/konsultasiSessionModel");

exports.getRiwayatKonsultasi = (req, res) => {
  const userId = req.params.userId;

  const sql = `
      SELECT ks.*, 
        p.id AS id_pengacara, 
        p.nama AS nama_pengacara, 
        p.upload_foto AS foto_pengacara,
        p.harga_konsultasi
  FROM konsultasi_session ks
  LEFT JOIN pengacara p ON ks.pengacara_id = p.id
  WHERE ks.user_id = ?
  ORDER BY ks.start_time DESC;
    `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Gagal mengambil riwayat konsultasi:", err);
      return res.status(500).json({ message: "Gagal mengambil data riwayat konsultasi" });
    }
    res.json(results);
  });
};


exports.getRiwayatKonsultasiByPengacara = (req, res) => {
  const pengacaraId = req.params.pengacaraId;

  const sql = `
    SELECT ks.*,
           p.id AS id_pengacara,
           p.nama AS nama_pengacara,
           p.upload_foto AS foto_pengacara,
           p.harga_konsultasi
    FROM konsultasi_session ks
    LEFT JOIN pengacara p ON ks.pengacara_id = p.id
    WHERE ks.pengacara_id = ?
    ORDER BY ks.start_time DESC
  `;

  db.query(sql, [pengacaraId], (err, results) => {
    if (err) {
      console.error("Error fetching riwayat konsultasi pengacara:", err);
      return res.status(500).json({ message: "Gagal mengambil data riwayat konsultasi pengacara" });
    }
    res.json(results);
  });
};