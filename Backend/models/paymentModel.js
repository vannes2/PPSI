const db = require("../config/database");

const getPengacaraById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM pengacara WHERE id = ?", [id], (err, result) => {
      if (err) reject(err);
      else if (result.length === 0) reject(new Error("Pengacara tidak ditemukan"));
      else resolve(result[0]);
    });
  });
};

module.exports = { getPengacaraById };