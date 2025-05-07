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
  }
};

module.exports = KasusModel;
