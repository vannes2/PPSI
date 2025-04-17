const db = require("../config/database");

const Artikel = {
  createArtikel: (judul, filePath, callback) => {
    const sql = "INSERT INTO artikel (judul, filePath) VALUES (?, ?)";
    db.query(sql, [judul, filePath], (err, result) => {
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
  }
};

module.exports = Artikel;
