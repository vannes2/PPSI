const db = require('../config/database');

const KasusModel = {
  createKasus: (data, callback) => {
    const {
      user_id, nama, email, noHp, areaPraktik,
      jenisPengerjaan, biayaMin, biayaMax,
      estimasiSelesai, lokasi, deskripsi, bukti,
      status, lawyer_id
    } = data;

    const sql = `
      INSERT INTO ajukan_kasus (
        user_id, nama, email, no_hp, area_praktik,
        jenis_pengerjaan, biaya_min, biaya_max,
        estimasi_selesai, lokasi, deskripsi, bukti,
        status, lawyer_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      user_id, nama, email, noHp, areaPraktik,
      jenisPengerjaan, biayaMin, biayaMax,
      estimasiSelesai, lokasi, deskripsi, bukti || null,
      status || "Menunggu",
      lawyer_id || null
    ], callback);
  },

  updateKasus: (id, data, callback) => {
    const fields = [];
    const values = [];

    const mapping = {
      user_id: "user_id",
      nama: "nama",
      email: "email",
      noHp: "no_hp",
      areaPraktik: "area_praktik",
      jenisPengerjaan: "jenis_pengerjaan",
      biayaMin: "biaya_min",
      biayaMax: "biaya_max",
      estimasiSelesai: "estimasi_selesai",
      lokasi: "lokasi",
      deskripsi: "deskripsi",
      bukti: "bukti",
      status: "status",
      lawyer_id: "lawyer_id",
    };

    for (const key in data) {
      if (mapping[key]) {
        fields.push(`${mapping[key]} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return callback(null);

    const sql = `UPDATE ajukan_kasus SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    db.query(sql, values, callback);
  },

  deleteKasus: (id, callback) => {
    const sql = "DELETE FROM ajukan_kasus WHERE id = ?";
    db.query(sql, [id], callback);
  },

  getKasusByUserId: (user_id, callback) => {
    const sql = `
      SELECT ak.*, p.nama AS nama_pengacara
      FROM ajukan_kasus ak
      LEFT JOIN pengacara p ON ak.lawyer_id = p.id
      WHERE ak.user_id = ?
      ORDER BY ak.created_at DESC
    `;
    db.query(sql, [user_id], callback);
  },

  getAllKasus: (callback) => {
    const sql = `
      SELECT ak.*, p.nama AS nama_pengacara
      FROM ajukan_kasus ak
      LEFT JOIN pengacara p ON ak.lawyer_id = p.id
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
