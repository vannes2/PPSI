const fs = require('fs');
const path = require('path');
const Lawyer = require('../models/lawyerModel');
const db = require('../config/database');

// POST /api/lawyers/register
exports.register = async (req, res) => {
  try {
    const {
      nama, ktp, tanggalLahir, jenisKelamin, alamat, email,
      telepon, nomorIndukAdvokat, universitas, pendidikan,
      spesialisasi, pengalaman, username, password,
      linkedin, instagram, twitter
    } = req.body;

    const files = req.files || {};

    // Validasi file wajib
    if (!files.uploadKTP || !files.uploadFoto || !files.uploadKartuAdvokat || !files.uploadPKPA) {
      return res.status(400).json({ message: 'Semua file wajib diunggah!' });
    }

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
      pengalaman: Number(pengalaman),
      upload_ktp: files.uploadKTP[0].filename,
      upload_foto: files.uploadFoto[0].filename,
      upload_kartu_advokat: files.uploadKartuAdvokat[0].filename,
      upload_pkpa: files.uploadPKPA[0].filename,
      username,
      password,
      linkedin: linkedin || null,
      instagram: instagram || null,
      twitter: twitter || null,
      resume_cv: files.resumeCV ? files.resumeCV[0].filename : null,
      portofolio: files.portofolio ? files.portofolio[0].filename : null,
    };

    Lawyer.registerLawyer(data, (err, results) => {
      if (err) {
        console.error('Register error:', err);
        return res.status(500).json({ error: 'Pendaftaran gagal: ' + err.message });
      }
      res.status(201).json({ message: 'Pendaftaran berhasil!', data: results });
    });
  } catch (error) {
    console.error('Register exception:', error);
    res.status(500).json({ error: 'Pendaftaran gagal: ' + error.message });
  }
};

// GET /api/lawyers/registrations
exports.getRegistrations = (req, res) => {
  const query = "SELECT * FROM pendaftaran_pengacara";
  db.query(query, (err, results) => {
    if (err) {
      console.error('Get registrations error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// POST /api/lawyers/approve/:id
exports.approveLawyer = (req, res) => {
  const { id } = req.params;
  Lawyer.approveLawyer(id, (err) => {
    if (err) {
      console.error('Approve error:', err);
      return res.status(500).json({ error: err.message });
    }
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
    console.error('Reject error:', error);
    res.status(500).json({ error: "Gagal menolak pendaftaran." });
  }
};

// GET /api/lawyer/profile/:id
exports.getLawyerProfile = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT id, nama, tanggal_lahir, jenis_kelamin, alamat, email, no_hp, 
           nomor_induk_advokat, universitas, pendidikan, spesialisasi, pengalaman, 
           username, upload_foto, linkedin, instagram, twitter, resume_cv, portofolio
    FROM pengacara
    WHERE id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Get profile error:', err);
      return res.status(500).json({ message: "Gagal mengambil data" });
    }
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
    username,
    linkedin,
    instagram,
    twitter,
  } = req.body;

  const files = req.files || {};
  const uploadFotoBaru = files.upload_foto ? files.upload_foto[0].filename : null;
  const uploadResumeBaru = files.resumeCV ? files.resumeCV[0].filename : null;
  const uploadPortofolioBaru = files.portofolio ? files.portofolio[0].filename : null;

  const sqlGetOldFiles = 'SELECT upload_foto, resume_cv, portofolio FROM pengacara WHERE id = ?';
  db.query(sqlGetOldFiles, [id], (err, results) => {
    if (err) {
      console.error('Get old files error:', err);
      return res.status(500).json({ message: "Gagal memperbarui profil" });
    }

    const oldFiles = results[0] || {};

    // Hapus file lama jika ada file baru
    if (uploadFotoBaru && oldFiles.upload_foto) {
      fs.unlink(path.join(__dirname, '../uploads', oldFiles.upload_foto), (e) => e && console.error(e));
    }
    if (uploadResumeBaru && oldFiles.resume_cv) {
      fs.unlink(path.join(__dirname, '../uploads', oldFiles.resume_cv), (e) => e && console.error(e));
    }
    if (uploadPortofolioBaru && oldFiles.portofolio) {
      fs.unlink(path.join(__dirname, '../uploads', oldFiles.portofolio), (e) => e && console.error(e));
    }

    const upload_foto_final = uploadFotoBaru || oldFiles.upload_foto || null;
    const resume_cv_final = uploadResumeBaru || oldFiles.resume_cv || null;
    const portofolio_final = uploadPortofolioBaru || oldFiles.portofolio || null;

    const sql = `
      UPDATE pengacara SET 
        nama = ?, alamat = ?, email = ?, no_hp = ?, 
        universitas = ?, pendidikan = ?, spesialisasi = ?, 
        pengalaman = ?, username = ?,
        linkedin = ?, instagram = ?, twitter = ?,
        upload_foto = ?, resume_cv = ?, portofolio = ?
      WHERE id = ?
    `;
    const values = [
      nama, alamat, email, no_hp,
      universitas, pendidikan, spesialisasi,
      pengalaman, username,
      linkedin || null, instagram || null, twitter || null,
      upload_foto_final, resume_cv_final, portofolio_final,
      id
    ];

    db.query(sql, values, (err2, result) => {
      if (err2) {
        console.error('Update profile error:', err2);
        return res.status(500).json({ message: "Gagal memperbarui profil" });
      }
      if (result.affectedRows === 0) return res.status(404).json({ message: "Pengacara tidak ditemukan" });
      res.status(200).json({ message: "Profil berhasil diperbarui" });
    });
  });
};


// GET /api/pengacara
exports.getAllLawyers = (req, res) => {
  console.log("🔥 getAllLawyers TERPANGGIL!"); // <- Tambahkan ini
  const sql = `
    SELECT 
      id, nama, ktp, tanggal_lahir, jenis_kelamin, alamat,
      email, no_hp, nomor_induk_advokat, universitas,
      pendidikan, spesialisasi, pengalaman,
      upload_ktp, upload_foto, upload_kartu_advokat, upload_pkpa,
      username, tanggal_daftar
    FROM pengacara
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Get all lawyers error:', err);
      return res.status(500).json({ message: "Gagal mengambil data pengacara" });
    }
    res.json(results);
  });
};

// Auto reject pendaftar expired (10 menit)
exports.autoRejectExpiredRegistrations = () => {
  const sql = `
    DELETE FROM pendaftaran_pengacara
    WHERE tanggal_daftar <= DATE_SUB(NOW(), INTERVAL 10 MINUTE)
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Gagal menjalankan auto reject pendaftar kadaluarsa:", err);
    } else if (result.affectedRows > 0) {
      console.log(`Auto reject: Menghapus ${result.affectedRows} pendaftaran pengacara kadaluarsa.`);
    }
  });
};
