const db = require("../config/database");

// Fungsi ini sesuai dengan route /riwayat/:userId
exports.getRiwayatKonsultasi = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT ks.*, 
           p.nama AS nama_pengacara, 
           p.upload_foto AS foto_pengacara
    FROM konsultasi_session ks
    LEFT JOIN pengacara p ON ks.pengacara_id = p.id
    WHERE ks.user_id = ?
    ORDER BY ks.start_time DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching riwayat konsultasi session:", err);
      return res.status(500).json({ message: "Gagal mengambil data riwayat konsultasi" });
    }
    res.json(results);
  });
};
