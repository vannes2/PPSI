const db = require("../config/database");

// Ambil riwayat Kasus & Konsultasi dari tabel riwayat_konsultasi_kasus
exports.getRiwayatUser = (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT * FROM riwayat_konsultasi_kasus
    WHERE user_id = ?
    ORDER BY tanggal DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Gagal mengambil riwayat:", err);
      return res.status(500).json({ error: "Gagal ambil data riwayat." });
    }

    const riwayatKonsultasi = results.filter(item => item.jenis_riwayat === "Konsultasi");
    const riwayatKasus = results.filter(item => item.jenis_riwayat === "Kasus");

    res.json({ riwayatKonsultasi, riwayatKasus });
  });
};

// Ambil riwayat konsultasi dari tabel konsultasi_session
exports.getRiwayatKonsultasi = (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT ks.*, p.nama AS nama_pengacara, p.upload_foto
    FROM konsultasi_session ks
    JOIN pengacara p ON ks.pengacara_id = p.id
    WHERE ks.user_id = ?
    ORDER BY ks.start_time DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Gagal mengambil riwayat konsultasi:", err);
      return res.status(500).json({ error: "Gagal ambil data konsultasi." });
    }

    res.json(results);
  });
};
