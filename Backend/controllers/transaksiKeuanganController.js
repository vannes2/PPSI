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
  `;

  // Ambil data ajukan_kasus selesai + is_transferred + biaya_pengacara untuk hitung pengeluaran dan pendapatan bersih
  const queryKasusDetail = `
    SELECT biaya_min, biaya_pengacara, is_transferred
    FROM ajukan_kasus
    WHERE status = 'Selesai'
  `;

  // Ambil data konsultasi selesai + is_transferred + biaya_pengacara
  const queryKonsultasiDetail = `
    SELECT biaya, biaya_pengacara, is_transferred
    FROM konsultasi_session
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
          kasusRows.forEach(({ biaya_min, biaya_pengacara, is_transferred }) => {
            if (is_transferred === 1) {
              // gunakan biaya_pengacara jika ada, jika null fallback ke biaya_min * 0.8
              const biayaAdvokat = biaya_pengacara !== null ? Number(biaya_pengacara) : biaya_min * 0.8;
              pengeluaran_kasus += biayaAdvokat;
              pendapatan_bersih_kasus += biaya_min - biayaAdvokat;
            }
          });

          let pendapatan_bersih_konsultasi = 0;
          let pengeluaran_konsultasi = 0;
          konsultasiRows.forEach(({ biaya, biaya_pengacara, is_transferred }) => {
            if (is_transferred === 1) {
              const biayaAdvokat = biaya_pengacara !== null ? Number(biaya_pengacara) : biaya * 0.8;
              pengeluaran_konsultasi += biayaAdvokat;
              pendapatan_bersih_konsultasi += biaya - biayaAdvokat;
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
      id, nama, biaya_min, biaya_pengacara, nama_pengacara, nama_rekening, no_rekening, status, created_at, is_transferred
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
      id, nama_user, nama_pengacara, start_time, duration, biaya, biaya_pengacara, status, is_transferred
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

  // Step 1: Update is_transferred = 1
  const updateTransferQuery = `UPDATE ${tableName} SET is_transferred = 1 WHERE id = ?`;

  db.query(updateTransferQuery, [id], (err, result) => {
    if (err) {
      console.error("❌ Error update status transfer:", err);
      return res.status(500).json({ message: "Gagal update status transfer" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    // Jika tipe konsultasi, update biaya_pengacara = biaya * 0.8
    if (type === "konsultasi") {
      // Ambil nilai biaya saat ini dari record yang diupdate
      const selectQuery = `SELECT biaya FROM konsultasi_session WHERE id = ?`;
      db.query(selectQuery, [id], (selectErr, rows) => {
        if (selectErr) {
          console.error("❌ Error ambil data biaya konsultasi:", selectErr);
          return res.status(500).json({ message: "Gagal mengambil data biaya konsultasi" });
        }
        if (rows.length === 0) {
          return res.status(404).json({ message: "Data konsultasi tidak ditemukan" });
        }

        const biaya = Number(rows[0].biaya) || 0;
        const biaya_pengacara = Math.round(biaya * 0.8);

        // Update biaya_pengacara di tabel
        const updateBiayaAdvokatQuery = `UPDATE konsultasi_session SET biaya_pengacara = ? WHERE id = ?`;
        db.query(updateBiayaAdvokatQuery, [biaya_pengacara, id], (updateErr) => {
          if (updateErr) {
            console.error("❌ Error update biaya_pengacara:", updateErr);
            return res.status(500).json({ message: "Gagal update biaya pengacara" });
          }
          return res.status(200).json({ message: "Status transfer dan biaya pengacara berhasil diupdate" });
        });
      });
    } else {
      // Untuk kasus, anggap sudah update biaya_pengacara saat input, langsung return sukses
      return res.status(200).json({ message: "Status transfer berhasil diupdate" });
    }
  });
};

