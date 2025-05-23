const db = require("../config/database");

const Artikel = {
  createArtikel: (
    judul, deskripsi, jenis_hukum, filePath, nomor, tahun,
    jenis_dokumen, tanggal_penetapan, tempat_penetapan, status, coverPath, callback
  ) => {
    const sql = `
      INSERT INTO artikel (
        judul, deskripsi, jenis_hukum, filePath,
        nomor, tahun, jenis_dokumen, tanggal_penetapan,
        tempat_penetapan, status, coverPath
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      judul, deskripsi, jenis_hukum, filePath, nomor, tahun,
      jenis_dokumen, tanggal_penetapan, tempat_penetapan, status, coverPath,
    ];
    db.query(sql, values, (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },

  getAllArtikel: (callback) => {
    db.query("SELECT * FROM artikel", (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  getArtikelById: (id, callback) => {
    db.query("SELECT * FROM artikel WHERE id = ?", [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  updateArtikel: (
    id, judul, deskripsi, jenis_hukum, filePath, nomor, tahun,
    jenis_dokumen, tanggal_penetapan, tempat_penetapan, status, coverPath, callback
  ) => {
    const fields = [
      "judul = ?", "deskripsi = ?", "jenis_hukum = ?", "nomor = ?",
      "tahun = ?", "jenis_dokumen = ?", "tanggal_penetapan = ?",
      "tempat_penetapan = ?", "status = ?"
    ];
    const values = [
      judul, deskripsi, jenis_hukum, nomor, tahun,
      jenis_dokumen, tanggal_penetapan, tempat_penetapan, status
    ];

    if (filePath) {
      fields.push("filePath = ?");
      values.push(filePath);
    }
    if (coverPath) {
      fields.push("coverPath = ?");
      values.push(coverPath);
    }

    values.push(id);

    const sql = `UPDATE artikel SET ${fields.join(", ")} WHERE id = ?`;

    db.query(sql, values, (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },

  deleteArtikel: (id, callback) => {
    db.query("DELETE FROM artikel WHERE id = ?", [id], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },
};

module.exports = Artikel;
