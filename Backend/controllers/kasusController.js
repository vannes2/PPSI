const db = require('../config/database');
const KasusModel = require('../models/kasusModel');

exports.ajukanKasus = (req, res) => {
  const data = req.body;
  let bukti = req.file ? req.file.filename : null;
  const newKasus = { ...data, bukti };

  KasusModel.createKasus(newKasus, (err) => {
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

  KasusModel.updateStatusKasus(id, status, (err) => {
    if (err) {
      console.error('Gagal memperbarui status:', err);
      return res.status(500).json({ message: 'Gagal memperbarui status kasus.' });
    }

    db.query('SELECT user_id FROM ajukan_kasus WHERE id = ?', [id], (err2, result) => {
      if (err2 || result.length === 0) {
        return res.status(500).json({ message: 'Status diperbarui, tapi gagal mencatat log aktivitas.' });
      }

      const userId = result[0].user_id;
      const aktivitas = `Status kasus ID ${id} diperbarui menjadi "${status}"`;

      KasusModel.logAktivitas(userId, aktivitas, (logErr) => {
        if (logErr) {
          console.error('Gagal menyimpan log aktivitas:', logErr);
          return res.status(500).json({ message: 'Status diperbarui, tapi gagal mencatat aktivitas.' });
        }

        res.status(200).json({ message: 'Status berhasil diperbarui dan dicatat ke log.' });
      });
    });
  });
};

exports.logAktivitas = (req, res) => {
  const { id_pengguna, aktivitas } = req.body;

  if (!id_pengguna || !aktivitas) {
    return res.status(400).json({ message: 'ID pengguna dan aktivitas wajib diisi.' });
  }

  KasusModel.logAktivitas(id_pengguna, aktivitas, (err) => {
    if (err) {
      console.error('Gagal menyimpan log aktivitas:', err);
      return res.status(500).json({ message: 'Gagal menyimpan log aktivitas.' });
    }

    res.status(201).json({ message: 'Log aktivitas berhasil disimpan.' });
  });
};

exports.getLogAktivitasByUser = (req, res) => {
  const userId = req.params.id;

  KasusModel.getAktivitasByUserId(userId, (err, results) => {
    if (err) {
      console.error('Gagal mengambil log aktivitas:', err);
      return res.status(500).json({ message: 'Gagal mengambil log aktivitas.' });
    }

    res.status(200).json(results);
  });
};

exports.ambilKasus = (req, res) => {
  const kasusId = req.params.id;
  const { lawyer_id } = req.body;

  if (!kasusId || !lawyer_id) {
    return res.status(400).json({ message: 'kasusId dan lawyer_id wajib diisi.' });
  }

  db.query(
    'UPDATE ajukan_kasus SET lawyer_id = ?, status = "Menunggu" WHERE id = ? AND lawyer_id IS NULL',
    [lawyer_id, kasusId],
    (err, result) => {
      if (err) {
        console.error('Gagal mengupdate lawyer_id:', err);
        return res.status(500).json({ message: 'Gagal mengambil kasus.' });
      }

      if (result.affectedRows === 0) {
        return res.status(400).json({ message: 'Kasus sudah diambil oleh pengacara lain.' });
      }

      res.status(200).json({ message: 'Kasus berhasil diambil.' });
    }
  );
};
