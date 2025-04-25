const Lawyer = require('../models/lawyerModel');
const db = require('../config/database'); // koneksi database

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
        // Password tidak di-hash, langsung simpan seperti apa adanya
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
            password // <-- simpan langsung
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
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: err.message });
        }

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

    if (!id) {
        return res.status(400).json({ error: "ID tidak ditemukan dalam permintaan." });
    }

    try {
        const [result] = await db.query("DELETE FROM pendaftaran_pengacara WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pendaftaran tidak ditemukan atau sudah dihapus." });
        }

        res.status(200).json({ message: "Pendaftaran ditolak dan dihapus." });
    } catch (error) {
        console.error("Error rejecting lawyer:", error);
        res.status(500).json({ error: "Gagal menolak pendaftaran." });
    }
};
