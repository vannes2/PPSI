const db = require('../config/database');

exports.registerLawyer = (data, callback) => {
    const sql = `INSERT INTO pengacara 
    (nama, ktp, tanggal_lahir, jenis_kelamin, alamat, email, no_hp, nomor_induk_advokat, universitas, pendidikan, spesialisasi, pengalaman, upload_ktp, upload_foto, upload_kartu_advokat, upload_pkpa, username, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        data.nama, data.ktp, data.tanggal_lahir, data.jenis_kelamin, data.alamat, data.email, data.no_hp,
        data.nomor_induk_advokat, data.universitas, data.pendidikan, data.spesialisasi, data.pengalaman,
        data.upload_ktp, data.upload_foto, data.upload_kartu_advokat, data.upload_pkpa,
        data.username, data.password
    ];

    db.query(sql, values, callback);
};
