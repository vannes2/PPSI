const express = require("express");
const router = express.Router();
const db = require("../config/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pastikan folder upload chat_files ada, buat jika belum ada
const uploadDir = path.join(__dirname, "..", "uploads", "chat_files");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer untuk upload file chat
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // maksimal 10MB, sesuaikan jika perlu
  fileFilter: (req, file, cb) => {
    // Optional: batasi tipe file (gambar, pdf, doc, dll)
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Tipe file tidak diizinkan"));
    }
  },
});

/**
 * Endpoint 1: Ambil Semua Kontak (User + Pengacara)
 */
router.get("/contacts", (req, res) => {
  const contacts = [];

  db.query('SELECT id, name, "user" as role FROM users', (err, userResults) => {
    if (err) return res.status(500).json({ message: "Error ambil users" });
    contacts.push(...userResults);

    db.query(
      'SELECT id, nama as name, "pengacara" as role FROM pengacara',
      (err, lawyerResults) => {
        if (err)
          return res.status(500).json({ message: "Error ambil pengacara" });
        contacts.push(...lawyerResults);
        res.json(contacts);
      }
    );
  });
});

/**
 * Endpoint 2: Ambil Histori Chat antara dua pihak (termasuk file jika ada)
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
  const params = [
    userId,
    userRole,
    contactId,
    contactRole,
    contactId,
    contactRole,
    userId,
    userRole,
  ];

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
 */
router.get("/contacts/lawyer/:lawyerId", (req, res) => {
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
      return res.status(500).json({ message: "Gagal mengambil kontak" });
    }
    res.json(results);
  });
});

/**
 * Ambil list pengacara yang pernah dihubungi user
 */
router.get("/contacts/user/:userId", (req, res) => {
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

/**
 * Endpoint baru: Kirim pesan dengan upload file (opsional)
 * Field 'file' sebagai nama file yang diupload
 */
router.post(
  "/send-message-file",
  upload.single("file"), // menerima file dengan field name 'file'
  (req, res) => {
    try {
      const { sender_id, sender_role, receiver_id, receiver_role, message } = req.body;
      const file = req.file ? req.file.filename : null;

      const sql = `
        INSERT INTO messages 
        (sender_id, sender_role, receiver_id, receiver_role, message, file) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const params = [sender_id, sender_role, receiver_id, receiver_role, message, file];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.error("Error simpan pesan:", err);
          return res.status(500).json({ message: "Gagal menyimpan pesan" });
        }
        res.json({ message: "Pesan terkirim", id: result.insertId, file });
      });
    } catch (error) {
      console.error("Error pada upload file chat:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat mengirim pesan" });
    }
  }
);

module.exports = router;
