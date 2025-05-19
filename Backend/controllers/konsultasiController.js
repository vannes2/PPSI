const db = require("../config/database");

/**
 * Ambil riwayat konsultasi session user berdasarkan userId
 */
exports.getRiwayatKonsultasi = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT ks.id, ks.user_id, ks.pengacara_id, ks.start_time, ks.duration, ks.status, ks.created_at,
           p.nama AS nama_pengacara
    FROM konsultasi_session ks
    JOIN pengacara p ON ks.pengacara_id = p.id
    WHERE ks.user_id = ?
    ORDER BY ks.start_time DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Gagal ambil riwayat konsultasi:", err);
      return res.status(500).json({ message: "Gagal mengambil riwayat konsultasi" });
    }
    res.json(results);
  });
};
