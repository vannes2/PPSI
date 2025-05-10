const KasusModel = require('../models/kasusModel');

exports.ajukanKasus = (req, res) => {
  const data = req.body;
  let bukti = null;

  if (req.file) {
    bukti = req.file.filename;
  }

  const newKasus = { ...data, bukti };

  KasusModel.createKasus(newKasus, (err, result) => {
    if (err) {
      console.error('Gagal mengajukan kasus:', err);
      return res.status(500).json({ message: 'Gagal menyimpan data kasus.' });
    }
    res.status(201).json({ message: 'Berhasil mengajukan kasus.' });
  });
};

exports.getKasusByUserId = (req, res) => {
  const userId = req.params.id;

  KasusModel.getKasusByUserId(userId, (err, results) => {
    if (err) {
      console.error('Gagal mengambil data:', err);
      return res.status(500).json({ message: 'Gagal mengambil data kasus.' });
    }
    res.status(200).json(results);
  });
};

exports.getAllKasus = (req, res) => {
  KasusModel.getAllKasus((err, results) => {
    if (err) {
      console.error('Gagal mengambil semua kasus:', err);
      return res.status(500).json({ message: 'Gagal mengambil data kasus.' });
    }
    res.status(200).json(results);
  });
};


exports.updateKasusStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Menunggu', 'Diproses', 'Selesai'].includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid.' });
  }

  KasusModel.updateStatusKasus(id, status, (err, result) => {
    if (err) {
      console.error('Gagal memperbarui status:', err);
      return res.status(500).json({ message: 'Gagal memperbarui status kasus.' });
    }
    res.status(200).json({ message: 'Status kasus berhasil diperbarui.' });
  });
};
