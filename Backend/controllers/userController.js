const db = require("../config/database");
const bcrypt = require("bcrypt");

exports.getProfileById = (req, res) => {
    const { id } = req.params;
    db.query("SELECT id, name, email, phone FROM users WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Terjadi kesalahan" });
        if (result.length === 0) return res.status(404).json({ message: "Profil tidak ditemukan" });
        res.json(result[0]);
    });
};

exports.getProfileByEmail = (req, res) => {
    const { email } = req.params;
    db.query("SELECT id, name, email, phone FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ message: "Terjadi kesalahan" });
        if (result.length === 0) return res.status(404).json({ message: "Profil tidak ditemukan" });
        res.json(result[0]);
    });
};
exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, password } = req.body;

  try {
      let hashedPassword = null;
      if (password) {
          hashedPassword = await bcrypt.hash(password, 10);
      }

      const sql = `UPDATE users SET name = ?, email = ?, phone = ? ${password ? ", password = ?" : ""} WHERE id = ?`;
      const values = password ? [name, email, phone, hashedPassword, id] : [name, email, phone, id];

      console.log("QUERY:", sql);
      console.log("VALUES:", values);

      db.query(sql, values, (err, result) => {
          if (err) {
              console.error("Error Query:", err);
              return res.status(500).json({ message: "Terjadi kesalahan pada server", error: err });
          }
          if (result.affectedRows === 0) {
              return res.status(404).json({ message: "User tidak ditemukan atau tidak ada perubahan" });
          }
          res.json({ message: "Profil berhasil diperbarui" });
      });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

