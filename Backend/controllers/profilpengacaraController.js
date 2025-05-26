const fs = require("fs");
const path = require("path");
const db = require("../config/database");

// Ambil semua pengacara lengkap dengan kolom yang dibutuhkan
exports.getAllPengacara = (req, res) => {
  const sql = `
    SELECT
      id,
      nama,
      email,
      spesialisasi,
      pendidikan,
      pengalaman,
      harga_konsultasi,
      upload_foto,
      bank_name,
      account_name,
      account_number
    FROM pengacara
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching pengacara:", err);
      return res.status(500).json({ message: "Gagal mengambil data pengacara" });
    }
    res.status(200).json(results);
  });
};

// Upload atau update foto pengacara
exports.uploadFotoPengacara = (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: "File tidak ditemukan." });
  }

  const filename = req.file.filename;

  // Cek dan hapus foto lama jika ada
  db.query("SELECT upload_foto FROM pengacara WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Gagal cek foto lama:", err);
      return res.status(500).json({ message: "Gagal cek foto lama" });
    }

    const oldFile = results[0]?.upload_foto;

    if (oldFile) {
      const filePath = path.resolve(__dirname, "..", "uploads", oldFile);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.error("Gagal hapus file lama:", unlinkErr);
        }
      }
    }

    // Update nama file baru di database
    db.query("UPDATE pengacara SET upload_foto = ? WHERE id = ?", [filename, id], (err2) => {
      if (err2) {
        console.error("Gagal update foto baru:", err2);
        return res.status(500).json({ message: "Gagal menyimpan foto baru" });
      }

      res.status(200).json({ message: "Foto berhasil diunggah", filename });
    });
  });
};
