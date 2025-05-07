const db = require("../config/database");

// Ambil semua pengacara
exports.getAllPengacara = (req, res) => {
  const sql = `
    SELECT id, nama, spesialisasi, pengalaman, harga_konsultasi, upload_foto
    FROM pengacara
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching pengacara:", err);
      return res.status(500).json({ message: "Gagal mengambil data pengacara" });
    }

    res.status(200).json(result);
  });
};

// Upload atau update foto pengacara
exports.uploadFotoPengacara = (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "File tidak ditemukan." });
  }

  const filename = req.file.filename;

  // Cek foto lama
  db.query("SELECT upload_foto FROM pengacara WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal cek foto lama" });

    const oldFile = results[0]?.upload_foto;

    if (oldFile) {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(__dirname, "..", "uploads", oldFile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // Update foto baru
    db.query("UPDATE pengacara SET upload_foto = ? WHERE id = ?", [filename, id], (err2) => {
      if (err2) return res.status(500).json({ message: "Gagal menyimpan foto baru" });

      res.status(200).json({ message: "Foto berhasil diunggah", filename });
    });
  });
};
