const fs = require('fs');
const path = require('path');
const Lawyer = require('../models/lawyerModel');
const db = require('../config/database');

// POST /api/lawyers/register
exports.register = async (req, res) => {
  const {
    nama, ktp, tanggalLahir, jenisKelamin, alamat, email,
    telepon, nomorIndukAdvokat, universitas, pendidikan,
    spesialisasi, pengalaman, username, password
  } = req.body;

  const files = req.files;
  if (!files.uploadKTP || !files.uploadFoto || !files.uploadKartuAdvokat || !files.uploadPKPA) {
    return res.status(400).json({ message: 'Semua file harus diunggah!' });
  }

  try {
    const data = {
      nama,
      ktp,
      tanggal_lahir: tanggalLahir,
      jenis_kelamin: jenisKelamin,
      alamat,
      email,
      no_hp: telepon,
      nomor_induk_advokat: nomorIndukAdvokat,
      universitas,
      pendidikan,
      spesialisasi,
      pengalaman,
      upload_ktp: files.uploadKTP[0].filename,
      upload_foto: files.uploadFoto[0].filename,
      upload_kartu_advokat: files.uploadKartuAdvokat[0].filename,
      upload_pkpa: files.uploadPKPA[0].filename,
      username,
      password
    };

    Lawyer.registerLawyer(data, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Pendaftaran berhasil!', data: results });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/lawyers/registrations
exports.getRegistrations = (req, res) => {
  const query = "SELECT * FROM pendaftaran_pengacara";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// POST /api/lawyers/approve/:id
exports.approveLawyer = (req, res) => {
  const { id } = req.params;
  Lawyer.approveLawyer(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Pendaftaran berhasil disetujui.' });
  });
};

// DELETE /api/lawyers/reject/:id
exports.rejectLawyer = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "ID tidak ditemukan dalam permintaan." });

  try {
    const [result] = await db.query("DELETE FROM pendaftaran_pengacara WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pendaftaran tidak ditemukan atau sudah dihapus." });
    }
    res.status(200).json({ message: "Pendaftaran ditolak dan dihapus." });
  } catch (error) {
    res.status(500).json({ error: "Gagal menolak pendaftaran." });
  }
};

// GET /api/lawyer/profile/:id
exports.getLawyerProfile = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT id, nama, tanggal_lahir, jenis_kelamin, alamat, email, no_hp, 
           nomor_induk_advokat, universitas, pendidikan, spesialisasi, pengalaman, username, upload_foto
    FROM pengacara
    WHERE id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data" });
    if (results.length === 0) return res.status(404).json({ message: "Pengacara tidak ditemukan" });
    res.json(results[0]);
  });
};

// PUT /api/lawyer/profile/update/:id
exports.updateLawyerProfile = (req, res) => {
  const { id } = req.params;
  const {
    nama,
    alamat,
    email,
    no_hp,
    universitas,
    pendidikan,
    spesialisasi,
    pengalaman,
    username
  } = req.body;

  const uploadFotoBaru = req.file ? req.file.filename : null;

  if (uploadFotoBaru) {
    const sqlGetOldPhoto = 'SELECT upload_foto FROM pengacara WHERE id = ?';
    db.query(sqlGetOldPhoto, [id], (err, results) => {
      if (err) return res.status(500).json({ message: "Gagal memperbarui profil" });

      const oldPhoto = results[0]?.upload_foto;
      if (oldPhoto) {
        const oldPhotoPath = path.join(__dirname, '../uploads', oldPhoto);
        fs.unlink(oldPhotoPath, (err) => {
          if (err) console.error("Gagal menghapus foto lama:", err);
        });
      }

      updateProfile(uploadFotoBaru);
    });
  } else {
    const sqlGetOldPhoto = 'SELECT upload_foto FROM pengacara WHERE id = ?';
    db.query(sqlGetOldPhoto, [id], (err, results) => {
      if (err) return res.status(500).json({ message: "Gagal memperbarui profil" });
      const existingPhoto = results[0]?.upload_foto || null;
      updateProfile(existingPhoto);
    });
  }

  function updateProfile(upload_foto) {
    const sql = `
      UPDATE pengacara SET 
        nama = ?, alamat = ?, email = ?, no_hp = ?, 
        universitas = ?, pendidikan = ?, spesialisasi = ?, 
        pengalaman = ?, username = ?, upload_foto = ?
      WHERE id = ?
    `;

    const values = [
      nama,
      alamat,
      email,
      no_hp,
      universitas,
      pendidikan,
      spesialisasi,
      pengalaman,
      username,
      upload_foto,
      id
    ];

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal memperbarui profil" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Pengacara tidak ditemukan" });
      res.status(200).json({ message: "Profil berhasil diperbarui" });
    });
  }
};

// GET /api/pengacara
exports.getAllLawyers = (req, res) => {
  const sql = `
    SELECT id, nama, ktp, tanggal_lahir, jenis_kelamin, alamat, email, no_hp,
           nomor_induk_advokat, universitas, pendidikan, spesialisasi, pengalaman,
           upload_ktp, upload_foto, upload_kartu_advokat, upload_pkpa,
           username, password, tanggal_daftar
    FROM pengacara
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data pengacara" });
    res.json(results);
  });
};

// **Fungsi auto reject otomatis untuk pendaftar yang lewat 10 menit**
exports.autoRejectExpiredRegistrations = () => {
  const sql = `
    DELETE FROM pendaftaran_pengacara
    WHERE tanggal_daftar <= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Gagal menjalankan auto reject pendaftar kadaluarsa:", err);
    } else {
      if (result.affectedRows > 0) {
        console.log(`Auto reject: Menghapus ${result.affectedRows} pendaftaran pengacara kadaluarsa.`);
      }
    }
  });
};
