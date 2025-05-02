const db = require("../config/database");

const Artikel = {
  createArtikel: (judul, deskripsi, jenis_hukum, filePath, callback) => {
    // Hapus koma ekstra setelah filePath
    const sql = "INSERT INTO artikel (judul, deskripsi, jenis_hukum, filePath) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [judul, deskripsi, jenis_hukum, filePath], (err, result) => {
      if (err) {
        console.error("Error saat insert artikel:", err);
        return callback(err);
      }
      callback(null, result);
    });
  },
  
  getAllArtikel: (callback) => {
    const sql = "SELECT * FROM artikel";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error saat ambil semua artikel:", err);
        return callback(err);
      }
      callback(null, results);
    });
  },
};

module.exports = Artikel;
