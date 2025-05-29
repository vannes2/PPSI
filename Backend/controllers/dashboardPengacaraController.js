const db = require('../config/database');

// Helper untuk validasi ID
const validatePengacaraId = (id, res) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId) || parsedId <= 0) {
    console.error("❌ ID pengacara tidak valid:", id);
    res.status(400).json({ message: "ID pengacara tidak valid. Mohon sediakan ID yang benar." });
    return null;
  }
  return parsedId;
};

exports.getDashboardSummary = (req, res) => {
  const pengacaraId = validatePengacaraId(req.params.id, res);
  if (pengacaraId === null) return;

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
      console.error("❌ Gagal mengambil data kasus untuk ID:", pengacaraId, ":", err1);
      return res.status(500).json({ message: "Gagal mengambil data kasus." });
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
        console.error("❌ Gagal mengambil data konsultasi untuk ID:", pengacaraId, ":", err2);
        return res.status(500).json({ message: "Gagal mengambil data konsultasi." });
      }

      summary.total_konsultasi_selesai = result2[0].total_konsultasi_selesai;
      summary.total_pendapatan_semua += Number(result2[0].total_dibayar);
      summary.sisa_belum_ditransfer += Number(result2[0].sisa_belum_transfer);

      return res.json(summary);
    });
  });
};

exports.getPendapatanBulanan = (req, res) => {
  const pengacaraId = validatePengacaraId(req.params.id, res);
  if (pengacaraId === null) return;

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
      console.error("❌ Gagal ambil pendapatan bulanan untuk ID:", pengacaraId, ":", err);
      return res.status(500).json({ message: "Gagal mengambil data pendapatan bulanan." });
    }
    res.json(results);
  });
};

// --- Fungsi Baru: Mendapatkan Jumlah Kasus dan Konsultasi Selesai per Bulan ---
exports.getMonthlyCaseConsultationCounts = (req, res) => {
  const pengacaraId = validatePengacaraId(req.params.id, res);
  if (pengacaraId === null) return;

  const sql = `
    SELECT
        bulan,
        COALESCE(SUM(total_kasus), 0) AS total_kasus_bulanan,
        COALESCE(SUM(total_konsultasi), 0) AS total_konsultasi_bulanan
    FROM (
        SELECT
            DATE_FORMAT(created_at, '%Y-%m') AS bulan,
            COUNT(*) AS total_kasus,
            0 AS total_konsultasi
        FROM ajukan_kasus
        WHERE status = 'Selesai' AND lawyer_id = ?
        GROUP BY bulan

        UNION ALL

        SELECT
            DATE_FORMAT(start_time, '%Y-%m') AS bulan,
            0 AS total_kasus,
            COUNT(*) AS total_konsultasi
        FROM konsultasi_session
        WHERE status = 'selesai' AND pengacara_id = ?
        GROUP BY bulan
    ) AS gabungan
    GROUP BY bulan
    ORDER BY bulan ASC;
  `;

  db.query(sql, [pengacaraId, pengacaraId], (err, results) => {
    if (err) {
      console.error("❌ Gagal ambil jumlah kasus/konsultasi bulanan untuk ID:", pengacaraId, ":", err);
      return res.status(500).json({ message: "Gagal mengambil data jumlah kasus/konsultasi bulanan." });
    }
    res.json(results);
  });
};

exports.getDetailTransaksi = (req, res) => {
  const pengacaraId = validatePengacaraId(req.params.id, res);
  if (pengacaraId === null) return;

  const sql = `
    SELECT 'Kasus' AS jenis, ak.id, u.name AS nama_user, ak.biaya_pengacara, ak.is_transferred, ak.created_at AS tanggal
    FROM ajukan_kasus ak
    LEFT JOIN users u ON ak.user_id = u.id
    WHERE ak.lawyer_id = ? AND ak.status = 'Selesai'

    UNION ALL

    SELECT 'Konsultasi', ks.id, u.name AS nama_user, ks.biaya_pengacara, ks.is_transferred, ks.start_time AS tanggal
    FROM konsultasi_session ks
    LEFT JOIN users u ON ks.user_id = u.id
    WHERE ks.pengacara_id = ? AND ks.status = 'selesai'

    ORDER BY tanggal DESC
  `;

  db.query(sql, [pengacaraId, pengacaraId], (err, results) => {
    if (err) {
      console.error("❌ Gagal ambil detail transaksi untuk ID:", pengacaraId, ":", err);
      return res.status(500).json({ message: "Gagal mengambil detail transaksi." });
    }
    res.json(results);
  });
};

exports.getNotifikasiTransfer = (req, res) => {
  const pengacaraId = validatePengacaraId(req.params.id, res);
  if (pengacaraId === null) return;

  const sql = `
    SELECT 'Kasus' AS jenis, id, created_at AS tanggal, biaya_pengacara
    FROM ajukan_kasus
    WHERE lawyer_id = ? AND is_transferred = 1 AND created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)
    UNION ALL
    SELECT 'Konsultasi', id, start_time AS tanggal, biaya_pengacara
    FROM konsultasi_session
    WHERE pengacara_id = ? AND is_transferred = 1 AND start_time >= DATE_SUB(NOW(), INTERVAL 1 DAY)
    ORDER BY tanggal DESC
  `;

  db.query(sql, [pengacaraId, pengacaraId], (err, results) => {
    if (err) {
      console.error("❌ Gagal ambil notifikasi transfer untuk ID:", pengacaraId, ":", err);
      return res.status(500).json({ message: "Gagal mengambil notifikasi transfer." });
    }
    res.json(results);
  });
};