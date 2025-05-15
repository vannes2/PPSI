const db = require('../config/database');

exports.registerLawyer = (data, callback) => {
  const sql = `
    INSERT INTO pendaftaran_pengacara (
      nama, ktp, tanggal_lahir, jenis_kelamin, alamat, email, no_hp,
      nomor_induk_advokat, universitas, pendidikan, spesialisasi, pengalaman,
      upload_ktp, upload_foto, upload_kartu_advokat, upload_pkpa,
      username, password,
      linkedin, instagram, twitter,
      resume_cv, portofolio
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.nama,
    data.ktp,
    data.tanggal_lahir,
    data.jenis_kelamin,
    data.alamat,
    data.email,
    data.no_hp,
    data.nomor_induk_advokat,
    data.universitas,
    data.pendidikan,
    data.spesialisasi,
    data.pengalaman,
    data.upload_ktp,
    data.upload_foto,
    data.upload_kartu_advokat,
    data.upload_pkpa,
    data.username,
    data.password,
    data.linkedin || null,
    data.instagram || null,
    data.twitter || null,
    data.resume_cv || null,
    data.portofolio || null,
  ];

  // Debug: pastikan jumlah kolom dan nilai sama
  if (values.length !== 23) {
    console.error("Jumlah nilai tidak sama dengan jumlah kolom insert!", values.length);
    return callback(new Error("Jumlah nilai tidak sama dengan jumlah kolom insert!"));
  }

  db.query(sql, values, callback);
};


// Ambil semua data pendaftar dari pendaftaran_pengacara
exports.getAllRegistrations = (callback) => {
  db.query('SELECT * FROM pendaftaran_pengacara', callback);
};

// Approve pendaftar dan pindahkan data ke tabel pengacara (sesuai kolom di tabel pengacara)
exports.approveLawyer = (id, callback) => {
  const getQuery = 'SELECT * FROM pendaftaran_pengacara WHERE id = ?';
  db.query(getQuery, [id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(new Error('Data tidak ditemukan'));

    const data = results[0];

    const insertQuery = `
      INSERT INTO pengacara (
        nama, ktp, tanggal_lahir, jenis_kelamin, alamat, email, no_hp,
        nomor_induk_advokat, universitas, pendidikan, spesialisasi, pengalaman,
        upload_ktp, upload_foto, upload_kartu_advokat, upload_pkpa,
        username, password, tanggal_daftar,
        linkedin, instagram, twitter,
        resume_cv, portofolio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)
    `;

    const values = [
      data.nama,
      data.ktp,
      data.tanggal_lahir,
      data.jenis_kelamin,
      data.alamat,
      data.email,
      data.no_hp,
      data.nomor_induk_advokat,
      data.universitas,
      data.pendidikan,
      data.spesialisasi,
      data.pengalaman,
      data.upload_ktp,
      data.upload_foto,
      data.upload_kartu_advokat,
      data.upload_pkpa,
      data.username,
      data.password,
      data.linkedin || null,
      data.instagram || null,
      data.twitter || null,
      data.resume_cv || null,
      data.portofolio || null,
    ];

    db.query(insertQuery, values, (insertErr) => {
      if (insertErr) return callback(insertErr);
      db.query('DELETE FROM pendaftaran_pengacara WHERE id = ?', [id], callback);
    });
  });
};
