const db = require('../config/database');

// Simpan ke tabel pendaftaran_pengacara
exports.registerLawyer = (data, callback) => {
    const sql = `
        INSERT INTO pendaftaran_pengacara (
            nama, ktp, tanggal_lahir, jenis_kelamin, alamat, email, no_hp,
            nomor_induk_advokat, universitas, pendidikan, spesialisasi, pengalaman,
            upload_ktp, upload_foto, upload_kartu_advokat, upload_pkpa,
            username, password
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        data.nama, data.ktp, data.tanggal_lahir, data.jenis_kelamin, data.alamat,
        data.email, data.no_hp, data.nomor_induk_advokat, data.universitas, data.pendidikan,
        data.spesialisasi, data.pengalaman, data.upload_ktp, data.upload_foto,
        data.upload_kartu_advokat, data.upload_pkpa, data.username, data.password
    ];
    db.query(sql, values, callback);
};

// Ambil semua pendaftar
exports.getAllRegistrations = (callback) => {
    db.query('SELECT * FROM pendaftaran_pengacara', callback);
};

// Approve pendaftaran (pindahkan ke tabel pengacara)
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
                username, password
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            data.nama, data.ktp, data.tanggal_lahir, data.jenis_kelamin, data.alamat,
            data.email, data.no_hp, data.nomor_induk_advokat, data.universitas, data.pendidikan,
            data.spesialisasi, data.pengalaman, data.upload_ktp, data.upload_foto,
            data.upload_kartu_advokat, data.upload_pkpa, data.username, data.password
        ];

        db.query(insertQuery, values, (insertErr) => {
            if (insertErr) return callback(insertErr);
            db.query('DELETE FROM pendaftaran_pengacara WHERE id = ?', [id], callback);
        });
    });
};
