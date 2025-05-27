const db = require("../config/database");

// Endpoint mendapatkan total pendapatan dan pengeluaran sesuai logika is_transferred
exports.getTotalPendapatan = (req, res) => {
  const queryKasus = `
    SELECT 
      biaya_min, is_transferred
    FROM ajukan_kasus
    WHERE status = 'Selesai'
  `;

  const queryKonsultasi = `
    SELECT 
      biaya, is_transferred
    FROM konsultasi_session
    WHERE status = 'selesai'
  `;

  db.query(queryKasus, (err1, kasusRows) => {
    if (err1) {
      console.error("❌ Error mengambil total kasus:", err1);
      return res.status(500).json({ message: "Gagal mengambil total dari ajukan_kasus" });
    }

    db.query(queryKonsultasi, (err2, konsultasiRows) => {
      if (err2) {
        console.error("❌ Error mengambil total konsultasi:", err2);
        return res.status(500).json({ message: "Gagal mengambil total dari konsultasi_session" });
      }

      // Hitung total_kasus_kotor, pendapatan, pengeluaran sesuai is_transferred
      let total_kasus_kotor = 0;
      let pendapatan_bersih_kasus = 0;
      let pengeluaran_kasus = 0;

      kasusRows.forEach(({ biaya_min, is_transferred }) => {
        if (is_transferred === 1) {
          // Sudah transfer ke pengacara
          pengeluaran_kasus += biaya_min * 0.8;
          pendapatan_bersih_kasus += biaya_min * 0.2;
        } else {
          // Belum transfer, masuk kotor semua
          total_kasus_kotor += biaya_min;
        }
      });

      let total_konsultasi_kotor = 0;
      let pendapatan_bersih_konsultasi = 0;
      let pengeluaran_konsultasi = 0;

      konsultasiRows.forEach(({ biaya, is_transferred }) => {
        if (is_transferred === 1) {
          pengeluaran_konsultasi += biaya * 0.8;
          pendapatan_bersih_konsultasi += biaya * 0.2;
        } else {
          total_konsultasi_kotor += biaya;
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
};

// Endpoint ambil data kasus selesai lengkap untuk frontend tabel, termasuk is_transferred
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

// Endpoint ambil data konsultasi selesai lengkap untuk frontend tabel, termasuk is_transferred
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

// Endpoint untuk update status is_transferred kasus atau konsultasi
exports.updateTransferStatus = (req, res) => {
  const { type, id } = req.params; // type = 'kasus' atau 'konsultasi'

  let tableName = '';
  if (type === 'kasus') tableName = 'ajukan_kasus';
  else if (type === 'konsultasi') tableName = 'konsultasi_session';
  else return res.status(400).json({ message: "Type harus 'kasus' atau 'konsultasi'" });

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
