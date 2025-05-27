const db = require("../config/database");

// Fungsi ambil total pendapatan yang tetap (tidak dipisah status transfer)
exports.getTotalPendapatan = (req, res) => {
  // Total kotor dari semua ajukan_kasus selesai, tanpa filter is_transferred
  const queryTotalKasus = `
    SELECT SUM(biaya_min) AS total_kasus_kotor
    FROM ajukan_kasus
    WHERE status = 'Selesai'
  `;

  // Total kotor dari semua konsultasi selesai, tanpa filter is_transferred
  const queryTotalKonsultasi = `
    SELECT SUM(biaya) AS total_konsultasi_kotor
    FROM konsultasi_session
    WHERE status = 'selesai'
  `;

  // Ambil data ajukan_kasus selesai + is_transferred untuk hitung pengeluaran dan pendapatan bersih
  const queryKasusDetail = `
    SELECT biaya_min, is_transferred
    FROM ajukan_kasus
    WHERE status = 'Selesai'
  `;

  // Ambil data konsultasi selesai + is_transferred
  const queryKonsultasiDetail = `
    SELECT biaya, is_transferred
    FROM konsultasi_session
    WHERE status = 'selesai'
  `;

  db.query(queryTotalKasus, (err1, resultTotalKasus) => {
    if (err1) {
      console.error("❌ Error mengambil total kasus:", err1);
      return res.status(500).json({ message: "Gagal mengambil total dari ajukan_kasus" });
    }
    db.query(queryTotalKonsultasi, (err2, resultTotalKonsultasi) => {
      if (err2) {
        console.error("❌ Error mengambil total konsultasi:", err2);
        return res.status(500).json({ message: "Gagal mengambil total dari konsultasi_session" });
      }
      db.query(queryKasusDetail, (err3, kasusRows) => {
        if (err3) {
          console.error("❌ Error mengambil detail kasus:", err3);
          return res.status(500).json({ message: "Gagal mengambil detail kasus" });
        }
        db.query(queryKonsultasiDetail, (err4, konsultasiRows) => {
          if (err4) {
            console.error("❌ Error mengambil detail konsultasi:", err4);
            return res.status(500).json({ message: "Gagal mengambil detail konsultasi" });
          }

          const total_kasus_kotor = Number(resultTotalKasus[0].total_kasus_kotor) || 0;
          const total_konsultasi_kotor = Number(resultTotalKonsultasi[0].total_konsultasi_kotor) || 0;

          let pendapatan_bersih_kasus = 0;
          let pengeluaran_kasus = 0;
          kasusRows.forEach(({ biaya_min, is_transferred }) => {
            if (is_transferred === 1) {
              pengeluaran_kasus += biaya_min * 0.8;
              pendapatan_bersih_kasus += biaya_min * 0.2;
            }
          });

          let pendapatan_bersih_konsultasi = 0;
          let pengeluaran_konsultasi = 0;
          konsultasiRows.forEach(({ biaya, is_transferred }) => {
            if (is_transferred === 1) {
              pengeluaran_konsultasi += biaya * 0.8;
              pendapatan_bersih_konsultasi += biaya * 0.2;
            }
          });

          const total_kotor = total_kasus_kotor + total_konsultasi_kotor;
          const pendapatan_bersih = pendapatan_bersih_kasus + pendapatan_bersih_konsultasi;
          const total_pengeluaran = pengeluaran_kasus + pengeluaran_konsultasi;

          res.status(200).json({
            total_kasus_kotor,
            pendapatan_bersih_kasus,
            pengeluaran_kasus,
            total_konsultasi_kotor,
            pendapatan_bersih_konsultasi,
            pengeluaran_konsultasi,
            total_kotor,
            pendapatan_bersih,
            total_pengeluaran
          });
        });
      });
    });
  });
};

// Endpoint lain sama seperti sebelumnya
exports.getKasusSelesai = (req, res) => {
  const query = `
    SELECT 
      id, nama, biaya_min, nama_pengacara, nama_rekening, no_rekening, status, created_at, is_transferred
    FROM ajukan_kasus
    WHERE status = 'Selesai'
    ORDER BY created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error mengambil data kasus:", err);
      return res.status(500).json({ message: "Gagal mengambil data kasus" });
    }
    res.status(200).json(results);
  });
};

exports.getKonsultasiSelesai = (req, res) => {
  const query = `
    SELECT 
      id, nama_user, nama_pengacara, start_time, duration, biaya, status, is_transferred
    FROM konsultasi_session
    WHERE status = 'selesai'
    ORDER BY start_time DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error mengambil data konsultasi:", err);
      return res.status(500).json({ message: "Gagal mengambil data konsultasi" });
    }
    res.status(200).json(results);
  });
};

exports.updateTransferStatus = (req, res) => {
  const { type, id } = req.params;

  let tableName = "";
  if (type === "kasus") tableName = "ajukan_kasus";
  else if (type === "konsultasi") tableName = "konsultasi_session";
  else
    return res.status(400).json({
      message: "Type harus 'kasus' atau 'konsultasi'",
    });

  const query = `UPDATE ${tableName} SET is_transferred = 1 WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error update status transfer:", err);
      return res.status(500).json({ message: "Gagal update status transfer" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.status(200).json({ message: "Status transfer berhasil diupdate" });
  });
};
