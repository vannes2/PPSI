const db = require("../config/database");

// Fungsi buat atau update session konsultasi (overwrite session lama jika sudah ada)
const createOrUpdateSession = (userId, pengacaraId, duration) => {
  return new Promise((resolve, reject) => {
    const cekSql = "SELECT * FROM konsultasi_session WHERE user_id = ? AND pengacara_id = ? AND status = 'aktif' LIMIT 1";
    db.query(cekSql, [userId, pengacaraId], (err, results) => {
      if (err) return reject(err);

      const now = new Date();

      if (results.length > 0) {
        // Update start_time dan duration session yang sudah ada
        const updateSql = "UPDATE konsultasi_session SET start_time = ?, duration = ? WHERE id = ?";
        db.query(updateSql, [now, duration, results[0].id], (err2) => {
          if (err2) return reject(err2);
          // Ambil session yang sudah diupdate
          db.query("SELECT * FROM konsultasi_session WHERE id = ?", [results[0].id], (err3, rows) => {
            if (err3) return reject(err3);
            resolve(rows[0]);
          });
        });
      } else {
        // Buat session baru
        const insertSql = "INSERT INTO konsultasi_session (user_id, pengacara_id, start_time, duration) VALUES (?, ?, ?, ?)";
        db.query(insertSql, [userId, pengacaraId, now, duration], (err2, result) => {
          if (err2) return reject(err2);
          // Ambil session baru
          db.query("SELECT * FROM konsultasi_session WHERE id = ?", [result.insertId], (err3, rows) => {
            if (err3) return reject(err3);
            resolve(rows[0]);
          });
        });
      }
    });
  });
};

// Fungsi untuk mendapatkan session konsultasi aktif berdasarkan user dan pengacara
const getSession = (userId, pengacaraId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM konsultasi_session WHERE user_id = ? AND pengacara_id = ? AND status = 'aktif' LIMIT 1";
    db.query(sql, [userId, pengacaraId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
};

// Fungsi untuk menandai session selesai
const finishSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE konsultasi_session SET status = 'selesai' WHERE id = ?";
    db.query(sql, [sessionId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Fungsi getRiwayatByUserId dengan callback (dipakai di controller)
const getRiwayatByUserId = (userId, callback) => {
  const sql = `
    SELECT ks.*, 
           p.id AS id_pengacara, 
           p.nama AS nama_pengacara,
           p.upload_foto AS foto_pengacara
    FROM konsultasi_session ks
    LEFT JOIN pengacara p ON ks.pengacara_id = p.id
    WHERE ks.user_id = ?
    ORDER BY ks.start_time DESC
  `;
  db.query(sql, [userId], callback);
};

module.exports = {
  createOrUpdateSession,
  getSession,
  finishSession,
  getRiwayatByUserId  // Jangan lupa ekspor fungsi ini agar controller bisa akses
};
