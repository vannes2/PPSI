const db = require("../config/database");

// Riwayat Kasus berdasarkan pengacara (lawyer)
exports.getRiwayatKasusByPengacara = (req, res) => {
  const pengacaraId = req.params.pengacaraId;

  const sql = `
    SELECT ak.*, 
           u.id AS id_user,
           u.name AS nama_user,
           u.photo AS foto_user
    FROM ajukan_kasus ak
    LEFT JOIN users u ON ak.user_id = u.id
    WHERE ak.lawyer_id = ?
    ORDER BY ak.estimasi_selesai DESC
  `;

  db.query(sql, [pengacaraId], (err, results) => {
    if (err) {
      console.error("Gagal mengambil riwayat kasus pengacara:", err);
      return res.status(500).json({ message: "Gagal mengambil riwayat kasus" });
    }
    res.json(results);
  });
};

// Riwayat Konsultasi berdasarkan pengacara (lawyer)
exports.getRiwayatKonsultasiByPengacara = (req, res) => {
  const pengacaraId = req.params.pengacaraId;

  const sql = `
    SELECT ks.*, 
           u.id AS id_user,
           u.name AS nama_user,
           u.photo AS foto_user
    FROM konsultasi_session ks
    LEFT JOIN users u ON ks.user_id = u.id
    WHERE ks.pengacara_id = ?
    ORDER BY ks.start_time DESC
  `;

  db.query(sql, [pengacaraId], (err, results) => {
    if (err) {
      console.error("Gagal mengambil riwayat konsultasi pengacara:", err);
      return res.status(500).json({ message: "Gagal mengambil riwayat konsultasi" });
    }
    res.json(results);
  });
};
