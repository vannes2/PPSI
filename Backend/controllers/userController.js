const db = require("../config/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Setup multer untuk upload foto profil user
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/profile_photos");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// Fungsi format tanggal (sama seperti sebelumnya)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

// Ambil profil user berdasarkan ID (tambah kolom photo dan photo_url)
exports.getProfileById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT id, name, email, phone, birthdate, gender, address, photo
    FROM users WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Terjadi kesalahan" });
    if (result.length === 0)
      return res.status(404).json({ message: "Profil tidak ditemukan" });

    result[0].birthdate = formatDate(result[0].birthdate);

    if (result[0].photo) {
      result[0].photo_url = `/uploads/profile_photos/${result[0].photo}`;
    } else {
      result[0].photo_url = null;
    }

    res.json(result[0]);
  });
};

// Ambil profil berdasarkan email (juga menambahkan photo)
exports.getProfileByEmail = (req, res) => {
  const { email } = req.params;
  const sql = `
    SELECT id, name, email, phone, birthdate, gender, address, photo
    FROM users WHERE email = ?
  `;

  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Terjadi kesalahan" });
    if (result.length === 0)
      return res.status(404).json({ message: "Profil tidak ditemukan" });

    result[0].birthdate = formatDate(result[0].birthdate);

    if (result[0].photo) {
      result[0].photo_url = `/uploads/profile_photos/${result[0].photo}`;
    } else {
      result[0].photo_url = null;
    }

    res.json(result[0]);
  });
};

// Update profil user dengan upload foto (multipart/form-data)
exports.updateUserProfileWithPhoto = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;
  let photoFilename = null;

  if (req.file) {
    photoFilename = req.file.filename;
  }

  // Ambil data user lama untuk hapus foto lama kalau ada
  db.query("SELECT photo FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error server", error: err });
    if (results.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

    const oldPhoto = results[0].photo;

    const sql = photoFilename
      ? "UPDATE users SET name = ?, email = ?, phone = ?, address = ?, photo = ? WHERE id = ?"
      : "UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?";
    const params = photoFilename
      ? [name, email, phone, address, photoFilename, id]
      : [name, email, phone, address, id];

    db.query(sql, params, (err2, result) => {
      if (err2) return res.status(500).json({ message: "Gagal update profil", error: err2 });

      // Hapus foto lama kalau ada dan sudah diganti
      if (photoFilename && oldPhoto) {
        const oldPhotoPath = path.join(__dirname, "..", "uploads", "profile_photos", oldPhoto);
        fs.unlink(oldPhotoPath, (err3) => {
          if (err3) console.error("Gagal hapus foto lama:", err3);
        });
      }

      res.json({ message: "Profil berhasil diperbarui" });
    });
  });
};

exports.upload = upload; // export middleware multer
