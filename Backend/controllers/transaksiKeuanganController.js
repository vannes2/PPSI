const db = require("../config/database");

exports.getTotalPendapatan = (req, res) => {
  const queryKasus = `
    SELECT SUM(biaya_min) AS total_kasus_kotor 
    FROM ajukan_kasus 
    WHERE status = 'Selesai'
  `;

  const queryKonsultasi = `
    SELECT SUM(biaya) AS total_konsultasi_kotor 
    FROM konsultasi_session 
    WHERE status = 'selesai'
  `;

  db.query(queryKasus, (err1, result1) => {
    if (err1) {
      console.error("❌ Error mengambil total kasus:", err1);
      return res.status(500).json({ message: "Gagal mengambil total dari ajukan_kasus" });
    }

    db.query(queryKonsultasi, (err2, result2) => {
      if (err2) {
        console.error("❌ Error mengambil total konsultasi:", err2);
        return res.status(500).json({ message: "Gagal mengambil total dari konsultasi_session" });
      }

      const total_kasus_kotor = Number(result1[0].total_kasus_kotor) || 0;
      const total_konsultasi_kotor = Number(result2[0].total_konsultasi_kotor) || 0;

      const pendapatan_bersih_kasus = Math.round(total_kasus_kotor * 0.2);
      const pendapatan_bersih_konsultasi = Math.round(total_konsultasi_kotor * 0.2);

      const pengeluaran_kasus = total_kasus_kotor - pendapatan_bersih_kasus;
      const pengeluaran_konsultasi = total_konsultasi_kotor - pendapatan_bersih_konsultasi;

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
