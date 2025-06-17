const db = require('../config/database');

// 1. READ (Get All Reviews for Admin)
exports.getAllReviews = async (req, res) => {
    try {
        const sql = `
            SELECT 
                r.id, r.rating, r.komentar, r.tanggal_review, 
                u.name as user_name,
                p.nama as pengacara_name
            FROM review_pengacara r
            JOIN users u ON r.user_id = u.id
            JOIN pengacara p ON r.pengacara_id = p.id
            ORDER BY r.tanggal_review DESC
        `;
        const [reviews] = await db.promise().execute(sql);
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error di getAllReviews:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};

// 2. UPDATE (Update a Review by Admin)
exports.updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, komentar } = req.body;
    if (rating === undefined || komentar === undefined) {
        return res.status(400).json({ message: 'Rating dan komentar harus disertakan.' });
    }
    try {
        const sql = 'UPDATE review_pengacara SET rating = ?, komentar = ? WHERE id = ?';
        const [result] = await db.promise().execute(sql, [rating, komentar, reviewId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ulasan tidak ditemukan.' });
        }
        const [updatedReview] = await db.promise().execute(`
            SELECT r.id, r.rating, r.komentar, r.tanggal_review, u.name as user_name, p.nama as pengacara_name
            FROM review_pengacara r 
            JOIN users u ON r.user_id = u.id 
            JOIN pengacara p ON r.pengacara_id = p.id
            WHERE r.id = ?`, 
            [reviewId]
        );
        res.status(200).json({ message: 'Ulasan berhasil diperbarui.', review: updatedReview[0] });
    } catch (error) {
        console.error("Error di updateReview:", error);
        res.status(500).json({ message: 'Gagal mengupdate ulasan.' });
    }
};

// 3. DELETE (Delete a Review by Admin)
exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    try {
        const [result] = await db.promise().execute('DELETE FROM review_pengacara WHERE id = ?', [reviewId]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Ulasan tidak ditemukan.' });
        res.status(200).json({ message: 'Ulasan berhasil dihapus.' });
    } catch (error) {
        console.error("Error di deleteReview:", error);
        res.status(500).json({ message: 'Gagal menghapus ulasan.' });
    }
};

// 4. CREATE (Create a Review by Admin)
exports.adminCreateReview = async (req, res) => {
    const { pengacara_id, user_id, rating, komentar } = req.body;
    if (!pengacara_id || !user_id || !rating) {
        return res.status(400).json({ message: 'Pengacara ID, User ID, dan Rating wajib diisi.' });
    }
    try {
        const sql = 'INSERT INTO review_pengacara (pengacara_id, user_id, rating, komentar) VALUES (?, ?, ?, ?)';
        const [result] = await db.promise().execute(sql, [pengacara_id, user_id, rating, komentar]);
        const [newReview] = await db.promise().execute(
            `SELECT r.id, r.rating, r.komentar, r.tanggal_review, u.name as user_name, p.nama as pengacara_name
             FROM review_pengacara r 
             JOIN users u ON r.user_id = u.id 
             JOIN pengacara p ON r.pengacara_id = p.id
             WHERE r.id = ?`,
            [result.insertId]
        );
        res.status(201).json({ message: 'Ulasan berhasil dibuat oleh admin!', review: newReview[0] });
    } catch (error) {
        console.error("Error di adminCreateReview:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};

// 5. CREATE (Create a Review by User)
exports.createUserReview = async (req, res) => {
    const { pengacara_id, user_id, rating, komentar, kasus_id = null, konsultasi_id = null } = req.body;

    if (!pengacara_id || !user_id || !rating) {
        return res.status(400).json({ message: 'Pengacara ID, User ID, dan Rating wajib diisi.' });
    }

    try {
        // Cek apakah sudah pernah memberikan review
        const [existing] = await db.promise().execute(
            `SELECT id FROM review_pengacara 
             WHERE user_id = ? AND pengacara_id = ? 
             AND (kasus_id = ? OR konsultasi_id = ?)`,
            [user_id, pengacara_id, kasus_id, konsultasi_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Anda sudah memberi ulasan.' });
        }

        const sql = `INSERT INTO review_pengacara 
                     (pengacara_id, user_id, rating, komentar, kasus_id, konsultasi_id) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        await db.promise().execute(sql, [pengacara_id, user_id, rating, komentar, kasus_id, konsultasi_id]);

        res.status(201).json({ message: 'Ulasan berhasil dikirim!' });
    } catch (error) {
        console.error("Error di createUserReview:", error);
        res.status(500).json({ message: 'Gagal menyimpan ulasan.' });
    }
};

// 5. Get Average Rating & Total Reviews by Pengacara ID
exports.getRatingByPengacara = async (req, res) => {
    const { pengacaraId } = req.params;
    try {
        const [result] = await db.promise().execute(`
            SELECT 
                AVG(rating) AS average_rating,
                COUNT(*) AS total_reviews
            FROM review_pengacara
            WHERE pengacara_id = ?
        `, [pengacaraId]);

        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error di getRatingByPengacara:", error);
        res.status(500).json({ message: "Gagal mengambil data rating." });
    }
};
