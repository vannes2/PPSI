const express = require("express");
const router = express.Router();
const db = require("../config/database");

/**
 * Endpoint 1: Ambil Semua Kontak (User + Pengacara)
 * Digunakan jika butuh list gabungan semua user & pengacara
 */
router.get("/contacts", (req, res) => {
    const contacts = [];

    db.query('SELECT id, name, "user" as role FROM users', (err, userResults) => {
        if (err) return res.status(500).json({ message: "Error ambil users" });
        contacts.push(...userResults);

        db.query('SELECT id, nama as name, "pengacara" as role FROM pengacara', (err, lawyerResults) => {
            if (err) return res.status(500).json({ message: "Error ambil pengacara" });
            contacts.push(...lawyerResults);
            res.json(contacts);
        });
    });
});

/**
 * Endpoint 2: Ambil Histori Chat antara dua pihak
 * Dinamis berdasarkan role & id
 */
router.get("/messages/:contactRole/:contactId", (req, res) => {
    const { contactRole, contactId } = req.params;
    const { userId, userRole } = req.query;

    const sql = `
        SELECT * FROM messages
        WHERE 
            (sender_id = ? AND sender_role = ? AND receiver_id = ? AND receiver_role = ?)
        OR  
            (sender_id = ? AND sender_role = ? AND receiver_id = ? AND receiver_role = ?)
        ORDER BY timestamp ASC
    `;
    const params = [userId, userRole, contactId, contactRole, contactId, contactRole, userId, userRole];

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error ambil pesan:", err);
            return res.status(500).json({ message: "Error ambil pesan" });
        }
        res.json(results);
    });
});

/**
 * Endpoint 3: Ambil List User yang Pernah Chat dengan Pengacara
 * Khusus halaman KonsultasiLawyer
 */
router.get('/contacts/lawyer/:lawyerId', (req, res) => {
    const { lawyerId } = req.params;

    const sql = `
        SELECT DISTINCT u.id, u.name, u.email
        FROM messages m
        JOIN users u 
            ON m.sender_id = u.id 
        WHERE m.receiver_id = ? 
          AND m.receiver_role = 'pengacara' 
          AND m.sender_role = 'user'
    `;

    db.query(sql, [lawyerId], (err, results) => {
        if (err) {
            console.error("Error ambil kontak:", err);
            return res.status(500).json({ message: 'Gagal mengambil kontak' });
        }
        res.json(results);
    });
});

// Ambil list pengacara yang pernah dihubungi user
router.get('/contacts/user/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `
      SELECT DISTINCT p.id, p.nama AS name, p.email
      FROM messages m
      JOIN pengacara p ON (
        (m.sender_id = p.id AND m.sender_role = 'pengacara' AND m.receiver_id = ? AND m.receiver_role = 'user') OR
        (m.receiver_id = p.id AND m.receiver_role = 'pengacara' AND m.sender_id = ? AND m.sender_role = 'user')
      )
    `;
    db.query(sql, [userId, userId], (err, results) => {
      if (err) {
        console.error("Gagal ambil kontak:", err);
        return res.status(500).json({ message: "Gagal ambil kontak" });
      }
      res.json(results);
    });
  });
  
module.exports = router;
