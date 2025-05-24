const db = require('../config/database.js');

// Ambil data ajukan_kasus yang sudah selesai
exports.getTransaksiKasus = (req, res) => {
  const query = `
    SELECT 
      ak.*, 
      p.nama AS nama_pengacara, 
      p.account_name AS nama_rekening, 
      p.account_number AS no_rekening 
    FROM ajukan_kasus ak
    LEFT JOIN pengacara p ON ak.lawyer_id = p.id
    WHERE ak.status = 'Selesai'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error getTransaksiKasus:', err);
      return res.status(500).json({ message: 'Gagal mengambil data transaksi kasus' });
    }
    res.json(results);
  });
};

// Ambil data konsultasi_session yang sudah selesai
exports.getTransaksiKonsultasi = (req, res) => {
  const query = `
    SELECT 
      ks.*, 
      u.nama AS nama_user, 
      p.nama AS nama_pengacara 
    FROM konsultasi_session ks
    LEFT JOIN pengguna u ON ks.user_id = u.id
    LEFT JOIN pengacara p ON ks.pengacara_id = p.id
    WHERE ks.status = 'selesai'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error getTransaksiKonsultasi:', err);
      return res.status(500).json({ message: 'Gagal mengambil data transaksi konsultasi' });
    }
    res.json(results);
  });
};
