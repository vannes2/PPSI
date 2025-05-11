const db = require('../config/database');

const KasusModel = {
  createKasus: (data, callback) => {
    const {
      user_id, nama, email, noHp, areaPraktik,
      jenisPengerjaan, biayaMin, biayaMax,
      estimasiSelesai, lokasi, deskripsi, bukti
    } = data;

    const sql = `
      INSERT INTO ajukan_kasus (
        user_id, nama, email, no_hp, area_praktik,
        jenis_pengerjaan, biaya_min, biaya_max,
        estimasi_selesai, lokasi, deskripsi, bukti
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      user_id, nama, email, noHp, areaPraktik,
      jenisPengerjaan, biayaMin, biayaMax,
      estimasiSelesai, lokasi, deskripsi, bukti
    ], callback);
  },

  getKasusByUserId: (user_id, callback) => {
    const sql = 'SELECT * FROM ajukan_kasus WHERE user_id = ? ORDER BY created_at DESC';
    db.query(sql, [user_id], callback);
  },

  // ✅ Menambahkan address dari tabel `users`
  getAllKasus: (callback) => {
    const sql = `
      SELECT ak.*, u.address AS alamat
      FROM ajukan_kasus ak
      LEFT JOIN users u ON ak.user_id = u.id
      ORDER BY ak.created_at DESC
    `;
    db.query(sql, callback);
  },

  updateStatusKasus: (id, status, callback) => {
    const sql = 'UPDATE ajukan_kasus SET status = ? WHERE id = ?';
    db.query(sql, [status, id], callback);
  },

  logAktivitas: (userId, aktivitas, callback) => {
    const sql = 'INSERT INTO log_aktivitas (id_pengguna, aktivitas) VALUES (?, ?)';
    db.query(sql, [userId, aktivitas], callback);
  },

  getAktivitasByUserId: (userId, callback) => {
    const sql = 'SELECT * FROM log_aktivitas WHERE id_pengguna = ? ORDER BY waktu DESC';
    db.query(sql, [userId], callback);
  }
};

module.exports = KasusModel;
