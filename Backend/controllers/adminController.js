const db = require("../config/database");
const fs = require("fs");
const path = require("path");

// ✅ GET profil admin
const getAdminProfile = (req, res) => {
  const sql = "SELECT id, name, email, phone, gender, birthdate, upload_foto FROM admin WHERE id = 1";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching admin data:", err);
      return res.status(500).json({ message: "Error fetching admin data" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(results[0]);
  });
};

// ✅ PUT update profil admin (dengan validasi password manual)
const updateAdminProfile = (req, res) => {
  const { name, email, phone, gender, birthdate, password } = req.body;

  if (!password) {
    return res.status(401).json({ message: "Password diperlukan" });
  }

  // Ambil password dari DB (plain text untuk pengembangan)
  db.query("SELECT password FROM admin WHERE id = 1", (err, results) => {
    if (err) {
      console.error("❌ Gagal ambil password admin:", err);
      return res.status(500).json({ message: "Gagal verifikasi password" });
    }

    const savedPassword = results[0]?.password;
    if (password !== savedPassword) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Ubah birthdate ke format YYYY-MM-DD jika perlu
    const parsedBirthdate = birthdate ? birthdate.split("T")[0] : null;

    const sqlUpdate = `
      UPDATE admin
      SET name = ?, email = ?, phone = ?, gender = ?, birthdate = ?
      WHERE id = 1
    `;
    db.query(sqlUpdate, [name, email, phone, gender, parsedBirthdate], (err2) => {
      if (err2) {
        console.error("❌ Gagal update profil:", err2);
        return res.status(500).json({ message: "Gagal menyimpan perubahan" });
      }

      res.json({ message: "✅ Profil berhasil diperbarui" });
    });
  });
};

// ✅ PUT upload foto admin
const uploadAdminPhoto = (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Tidak ada file yang diunggah" });
  }

  const filename = file.filename;

  const getOldPhoto = "SELECT upload_foto FROM admin WHERE id = 1";
  db.query(getOldPhoto, (err, results) => {
    if (err) {
      console.error("❌ Gagal ambil data lama:", err);
      return res.status(500).json({ message: "Gagal mengambil data lama" });
    }

    const oldFoto = results[0]?.upload_foto;
    if (oldFoto && fs.existsSync(path.join(__dirname, "../uploads", oldFoto))) {
      fs.unlinkSync(path.join(__dirname, "../uploads", oldFoto));
    }

    const sqlUpdateFoto = "UPDATE admin SET upload_foto = ? WHERE id = 1";
    db.query(sqlUpdateFoto, [filename], (err2) => {
      if (err2) {
        console.error("❌ Gagal menyimpan foto:", err2);
        return res.status(500).json({ message: "Gagal simpan foto" });
      }

      res.json({ message: "✅ Foto berhasil diupdate", upload_foto: filename });
    });
  });
};

module.exports = {
  getAdminProfile,
  updateAdminProfile,
  uploadAdminPhoto,
};
