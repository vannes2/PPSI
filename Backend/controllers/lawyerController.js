const Lawyer = require('../models/lawyerModel');
const bcrypt = require('bcrypt');

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
        const hashedPassword = await bcrypt.hash(password, 10);
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
            password: hashedPassword
        };

        Lawyer.registerLawyer(data, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Pendaftaran berhasil!', data: results });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
