const db = require('../config/database');

exports.getDashboardSummary = (req, res) => {
  const pengacaraId = req.params.id;
  console.log("📥 Mengambil dashboard untuk pengacara ID:", pengacaraId);

  const summary = {
    total_kasus_selesai: 0,
    total_konsultasi_selesai: 0,
    total_pendapatan_semua: 0,
    sisa_belum_ditransfer: 0,
  };

  // Query 1: Total kasus selesai & pendapatan
  const queryKasus = `
    SELECT 
      COUNT(*) AS total_kasus_selesai,
      COALESCE(SUM(biaya_pengacara), 0) AS total_dibayar,
      COALESCE(SUM(CASE WHEN is_transferred = 0 THEN biaya_pengacara ELSE 0 END), 0) AS sisa_belum_transfer
    FROM ajukan_kasus
    WHERE status = 'Selesai' AND lawyer_id = ?
  `;

  db.query(queryKasus, [pengacaraId], (err1, result1) => {
    if (err1) {
      console.error("❌ Gagal mengambil data kasus:", err1);
      return res.status(500).json({ message: "Gagal mengambil data kasus" });
    }

    summary.total_kasus_selesai = result1[0].total_kasus_selesai;
    summary.total_pendapatan_semua += Number(result1[0].total_dibayar);
    summary.sisa_belum_ditransfer += Number(result1[0].sisa_belum_transfer);

    // Query 2: Total konsultasi selesai & pendapatan
    const queryKonsultasi = `
      SELECT 
        COUNT(*) AS total_konsultasi_selesai,
        COALESCE(SUM(biaya_pengacara), 0) AS total_dibayar,
        COALESCE(SUM(CASE WHEN is_transferred = 0 THEN biaya_pengacara ELSE 0 END), 0) AS sisa_belum_transfer
      FROM konsultasi_session
      WHERE status = 'selesai' AND pengacara_id = ?
    `;

    db.query(queryKonsultasi, [pengacaraId], (err2, result2) => {
      if (err2) {
        console.error("❌ Gagal mengambil data konsultasi:", err2);
        return res.status(500).json({ message: "Gagal mengambil data konsultasi" });
      }

      summary.total_konsultasi_selesai = result2[0].total_konsultasi_selesai;
      summary.total_pendapatan_semua += Number(result2[0].total_dibayar);
      summary.sisa_belum_ditransfer += Number(result2[0].sisa_belum_transfer);

      return res.json(summary);
    });
  });
};

exports.getPendapatanBulanan = (req, res) => {
  const pengacaraId = req.params.id;

  const sql = `
    SELECT 
      DATE_FORMAT(created_at, '%Y-%m') AS bulan,
      SUM(biaya_pengacara) AS total
    FROM (
      SELECT created_at, biaya_pengacara FROM ajukan_kasus WHERE status = 'Selesai' AND lawyer_id = ?
      UNION ALL
      SELECT start_time AS created_at, biaya_pengacara FROM konsultasi_session WHERE status = 'selesai' AND pengacara_id = ?
    ) AS gabungan
    GROUP BY bulan
    ORDER BY bulan ASC
  `;

  db.query(sql, [pengacaraId, pengacaraId], (err, results) => {
    if (err) {
      console.error("❌ Gagal ambil pendapatan bulanan:", err);
      return res.status(500).json({ message: "Gagal ambil pendapatan bulanan" });
    }

    res.json(results);
  });
};

exports.getDetailTransaksi = (req, res) => {
  const pengacaraId = req.params.id;

  const sql = `
    SELECT 'Kasus' AS jenis, id, biaya_pengacara, is_transferred, created_at AS tanggal
    FROM ajukan_kasus
    WHERE lawyer_id = ? AND status = 'Selesai'
    UNION ALL
    SELECT 'Konsultasi', id, biaya_pengacara, is_transferred, start_time
    FROM konsultasi_session
    WHERE pengacara_id = ? AND status = 'selesai'
    ORDER BY tanggal DESC
  `;

  db.query(sql, [pengacaraId, pengacaraId], (err, results) => {
    if (err) {
      console.error("❌ Gagal ambil detail transaksi:", err);
      return res.status(500).json({ message: "Gagal ambil detail transaksi" });
    }

    res.json(results);
  });
};

exports.getNotifikasiTransfer = (req, res) => {
  const pengacaraId = req.params.id;

  const sql = `
    SELECT 'Kasus' AS jenis, id, created_at AS tanggal
    FROM ajukan_kasus
    WHERE lawyer_id = ? AND is_transferred = 1 AND created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)
    UNION ALL
    SELECT 'Konsultasi', id, start_time
    FROM konsultasi_session
    WHERE pengacara_id = ? AND is_transferred = 1 AND start_time >= DATE_SUB(NOW(), INTERVAL 1 DAY)
    ORDER BY tanggal DESC
  `;

  db.query(sql, [pengacaraId, pengacaraId], (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal ambil notifikasi" });
    res.json(results);
  });
};
