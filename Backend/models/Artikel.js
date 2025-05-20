const db = require("../config/database");

const Artikel = {
  createArtikel: (
    judul,
    deskripsi,
    jenis_hukum,
    filePath,
    nomor,
    tahun,
    jenis_dokumen,
    tanggal_penetapan,
    tempat_penetapan,
    status,
    coverPath, // parameter baru untuk cover
    callback
  ) => {
    const sql = `
      INSERT INTO artikel (
        judul, deskripsi, jenis_hukum, filePath,
        nomor, tahun, jenis_dokumen, tanggal_penetapan,
        tempat_penetapan, status, coverPath
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      judul,
      deskripsi,
      jenis_hukum,
      filePath,
      nomor,
      tahun,
      jenis_dokumen,
      tanggal_penetapan,
      tempat_penetapan,
      status,
      coverPath,
    ];

    try {
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("QUERY GAGAL:", err.sqlMessage || err.message);
          return callback(err);
        }
        callback(null, result);
      });
    } catch (e) {
      console.error("CATCH ERROR:", e.message);
      callback(e);
    }
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
};

module.exports = Artikel;
